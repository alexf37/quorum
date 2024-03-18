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
import { useRouter } from "next/navigation";

type DeleteAccountModalProps = PropsWithChildren;

export function DeleteAccountModal({ children }: DeleteAccountModalProps) {
  const router = useRouter();
  const deleteAccountMutation = api.settings.deleteAccount.useMutation({
    onSuccess: () => {
      router.push("/");
    },
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            acccount and remove its associated data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Button
            variant="destructive"
            onClick={() => {
              deleteAccountMutation.mutate();
            }}
            disabled={deleteAccountMutation.isLoading}
            asChild
          >
            <AlertDialogAction>Yes, I'm sure</AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
