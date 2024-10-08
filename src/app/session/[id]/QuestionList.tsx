"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { api } from "@/trpc/react";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { AddQuestionModal } from "@/components/AddQuestionModal";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function sendSocketMessage({
  room,
  name,
  value,
}: {
  room: string;
  name: string;
  value: string;
}) {
  const socket = io("https://connect.xsschat.com");
  socket.on("connect", () => {
    socket.emit("join", {
      room,
      name,
    });
    socket.emit("message", {
      value,
      name,
      type: "message",
    });
    setTimeout(() => {
      socket.disconnect();
    }, 500);
  });
}

export function QuestionList({ sessionId }: { sessionId: string }) {
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const { data: questions } =
    api.sessions.getFreeResponseQuestionsBySessionId.useQuery({
      sessionId,
    });
  const {
    data: currentQuestion,
    isSuccess: currentQuestionIsSuccess,
    isLoading: currentQuestionIsLoading,
    refetch: refetchCurrentQuestion,
  } = api.sessions.getCurrentFreeResponseQuestion.useQuery({
    sessionId,
  });
  const setCurrentQuestionMutation =
    api.sessions.setCurrentFreeResponseQuestion.useMutation({
      onSuccess: async () => {
        void refetchCurrentQuestion();
        sendSocketMessage({
          room: `quorum-listen-${sessionId ?? "waiting"}`,
          name: "quorumhost",
          value: "Question changed",
        });
      },
    });
  const {
    data: currentAnswerCount,
    isSuccess: currentAnswerIsSuccess,
    refetch: refetchAnswerCount,
  } = api.sessions.getCurrentAnswerCount.useQuery(
    { sessionId },
    {
      refetchInterval: 5000,
    },
  );
  const {
    data: currentStudentCount,
    isSuccess: currentStudentCountIsSuccess,
    refetch: refetchStudentCount,
  } = api.sessions.getCurrentStudentCount.useQuery(
    { sessionId },
    {
      refetchInterval: 5000,
    },
  );
  const {
    data: studentAnswers,
    isSuccess: studentAnswersIsSuccess,
    isLoading: studentAnswersIsLoading,
    refetch: refetchStudentAnswers,
  } = api.sessions.getStudentAnswersForCurrentQuestion.useQuery(
    { sessionId },
    {
      refetchInterval: 5000,
      enabled: !analysisOpen,
    },
  );
  useEffect(() => {
    void refetchAnswerCount();
    void refetchStudentCount();
    void refetchStudentAnswers();
  }, [
    currentQuestion?.id,
    refetchAnswerCount,
    refetchStudentCount,
    refetchStudentAnswers,
  ]);

  const analysisQuery = api.sessions.analyzeAnswers.useQuery(
    {
      sessionId,
      question: currentQuestion?.id ?? "",
    },
    {
      enabled: analysisOpen && currentQuestionIsSuccess,
    },
  );
  return (
    <TooltipProvider>
      <div className="grid h-full w-full grid-cols-12">
        <div className="col-span-3 border-r border-border bg-background">
          <div className="flex flex-col gap-2 px-6 py-6">
            <h1 className="pb-2 text-3xl font-bold text-primary">Questions</h1>
            <h2 className=" font-medium text-muted-foreground">
              Select a question to view or release it.
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 px-2">
              {questions?.map((question) => (
                <Tooltip key={question.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={
                        question.id === currentQuestion?.id
                          ? "secondary"
                          : "ghost"
                      }
                      className="h-min justify-start overflow-hidden"
                      disabled={
                        setCurrentQuestionMutation.isLoading ||
                        currentQuestionIsLoading
                      }
                      onClick={() => {
                        setCurrentQuestionMutation.mutate({
                          sessionId,
                          questionId:
                            question.id === currentQuestion?.id
                              ? undefined
                              : question.id,
                        });
                      }}
                    >
                      <div className="basis-full overflow-hidden overflow-ellipsis whitespace-nowrap text-left">
                        {!question.isLatex ? (
                          question.question
                        ) : (
                          <Latex>{question.question}</Latex>
                        )}
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm text-wrap">
                    <p>
                      {!question.isLatex ? (
                        question.question
                      ) : (
                        <Latex>{question.question}</Latex>
                      )}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
            <div className="flex flex-col px-2">
              <AddQuestionModal sessionId={sessionId}>
                <Button variant="outline">Add a question</Button>
              </AddQuestionModal>
            </div>
          </div>
        </div>
        <div className="col-span-6 grid max-h-screen place-content-center">
          {currentQuestionIsSuccess && currentQuestion && (
            <Card className="-mt-28 w-full max-w-prose border-0 pt-2 shadow-none">
              <CardHeader>
                <CardTitle>
                  {!currentQuestion.isLatex ? (
                    currentQuestion.question
                  ) : (
                    <Latex>{currentQuestion.question}</Latex>
                  )}
                </CardTitle>
                <CardDescription>Please answer appropriately.</CardDescription>
              </CardHeader>
              <CardContent>
                {currentStudentCountIsSuccess && currentAnswerIsSuccess && (
                  <div className="space-y-2">
                    <div className="rounded-full bg-muted">
                      <div
                        className="h-2 w-56 rounded-full bg-blue-500"
                        style={{
                          width: `${(currentAnswerCount / currentStudentCount) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground">{`${currentAnswerCount} of ${currentStudentCount} students have answered (${Math.round((currentAnswerCount / currentStudentCount) * 100)}%).`}</p>
                    {currentQuestionIsSuccess &&
                      studentAnswersIsSuccess &&
                      studentAnswers.length > 0 && (
                        <div className="pt-2">
                          <Dialog
                            open={analysisOpen}
                            onOpenChange={setAnalysisOpen}
                          >
                            <DialogTrigger asChild>
                              <Button variant="outline">
                                🪄 Analyze with AI
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle className="text-2xl leading-none">
                                  AI Analysis
                                </DialogTitle>
                                <DialogDescription>
                                  Summary and misconceptions
                                </DialogDescription>
                              </DialogHeader>
                              {analysisQuery.isSuccess && (
                                <div className="flex flex-col gap-2">
                                  <Latex>{analysisQuery.data.summary}</Latex>
                                  <Latex>
                                    {analysisQuery.data.misconception}
                                  </Latex>
                                </div>
                              )}
                              {analysisQuery.isLoading && <div>Loading...</div>}
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        <div className="col-span-3 flex h-full flex-col border-l border-border">
          <div className="flex flex-col gap-2 px-6 py-6">
            <h1 className="pb-2 text-3xl font-bold text-primary">Answers</h1>
            <h2 className=" font-medium text-muted-foreground">
              View the answers submitted for this question.
            </h2>
          </div>
          {studentAnswersIsSuccess && studentAnswers.length > 0 ? (
            <div className="flex flex-col gap-2 px-2">
              {studentAnswers.map((answer) => (
                <Tooltip key={answer.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      className="h-min justify-start overflow-hidden"
                      disabled={
                        setCurrentQuestionMutation.isLoading ||
                        studentAnswersIsLoading
                      }
                    >
                      <div className="basis-full overflow-hidden overflow-ellipsis whitespace-nowrap text-left">
                        {answer.answer}
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm text-wrap">
                    <p>{answer.answer}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          ) : (
            <div className="px-6">
              <p>No answers yet.</p>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
