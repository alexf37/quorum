"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { ScrollArea } from "./ui/scroll-area";
import Latex from "react-latex-next";

type ViewQuestionModalProps = React.PropsWithChildren<{
  questionNumber: number;
  questionContent: string;
  questionId: string;
}>;

export function ViewQuestionModal({
  questionContent,
  questionId,
  questionNumber,
  children,
}: ViewQuestionModalProps) {
  const answersQuery = api.sessions.getAnswersForQuestion.useQuery({
    questionId,
  });
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Question {questionNumber}</DialogTitle>
          <DialogDescription>
            <Latex>{questionContent}</Latex>
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-72 w-full rounded-md border">
          <ul className="divide-y border-border">
            {answersQuery.isSuccess &&
              answersQuery.data.map((answer) => (
                <li key={answer.id} className="flex justify-between p-3">
                  <h3>{answer.user.name}</h3>
                  <p>{answer.answer}</p>
                </li>
              ))}
          </ul>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
