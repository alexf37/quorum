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
import { useState } from "react";

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
  const [open, setOpen] = useState(false);
  const answersQuery = api.sessions.getAnswersForQuestion.useQuery(
    {
      questionId,
    },
    {
      enabled: open,
    },
  );
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Question {questionNumber}</DialogTitle>
          <DialogDescription>
            <Latex>{questionContent}</Latex>
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-fit  w-full rounded-md border">
          {answersQuery.isSuccess &&
            (answersQuery.data.length === 0 ? (
              <div className="grid h-24 place-content-center">
                <p className="p-3 text-muted-foreground">
                  No answers submitted.
                </p>
              </div>
            ) : (
              <ul className="max-h-96 divide-y border-border">
                {answersQuery.data.map((answer) => (
                  <li key={answer.id} className="flex justify-between p-3">
                    <h3>{answer.user.name}</h3>
                    <p>{answer.answer}</p>
                  </li>
                ))}
              </ul>
            ))}
          {answersQuery.isLoading && (
            <div className="grid h-24 place-content-center">
              <p className="p-3 text-muted-foreground">Loading...</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
