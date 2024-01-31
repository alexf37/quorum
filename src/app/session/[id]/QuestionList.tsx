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
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import io from "socket.io-client";
import { useEffect } from "react";

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
  useEffect(() => {
    void refetchAnswerCount();
    void refetchStudentCount();
  }, [currentQuestion?.id, refetchAnswerCount, refetchStudentCount]);
  return (
    <TooltipProvider>
      <div className="grid h-full w-full grid-cols-12">
        <div className="col-span-3 border-r border-border bg-background lg:col-span-2">
          <div className="flex flex-col gap-2 px-6 py-6">
            <h1 className="pb-2 text-3xl font-bold text-primary">Questions</h1>
            <h2 className=" font-medium text-muted-foreground">
              Select a question to view or release it.
            </h2>
          </div>
          <ul className="flex flex-col gap-2 px-2">
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
                    <li className="basis-full overflow-hidden overflow-ellipsis whitespace-nowrap text-left">
                      {question.question}
                    </li>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm text-wrap">
                  <p>{question.question}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </ul>
        </div>
        <div className="col-span-9 grid place-content-center">
          {currentQuestionIsSuccess && currentQuestion && (
            <Card className="-mt-28 w-full border-0 pt-2">
              <CardHeader>
                <CardTitle>{`${currentQuestion?.question}`}</CardTitle>
                <CardDescription>
                  Please answer in just a few sentences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Input disabled type="text" placeholder="Answer here..." />
                {currentStudentCountIsSuccess && currentAnswerIsSuccess && (
                  <div className="mt-2 rounded-full bg-muted-foreground">
                    <div
                      className="h-2 w-56 rounded-full bg-blue-500"
                      style={{
                        width: `${(currentAnswerCount / currentStudentCount) * 100}%`,
                      }}
                    ></div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button disabled>Submit Answer</Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
