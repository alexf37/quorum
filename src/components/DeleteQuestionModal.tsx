"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { type PropsWithChildren } from "react";
import { toast } from "@/components/ui/use-toast";

type DeleteQuestionModalProps = PropsWithChildren<{
  questionId: string;
  sessionId: string;
}>;

export function DeleteQuestionModal({
  children,
  questionId,
  sessionId,
}: DeleteQuestionModalProps) {
  const utils = api.useUtils();
  const deleteQuestionMutation =
    api.sessions.deleteFreeResponseQuestion.useMutation({
      onSuccess: () => {
        void utils.sessions.getFreeResponseQuestionsBySessionId.invalidate();
        toast({
          title: "Success!",
          description: "Question has been deleted",
        });
      },
    });
  return (
    <AlertDialog>
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            question and remove its associated data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Button
            variant="destructive"
            onClick={() => {
              deleteQuestionMutation.mutate({
                questionId,
                sessionId,
              });
            }}
            disabled={deleteQuestionMutation.isLoading}
            asChild
          >
            <AlertDialogAction>Delete question</AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
