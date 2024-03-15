"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Download, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type PropsWithChildren } from "react";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";

function downloadBlob(blob: Blob, name = "file.txt") {
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = name;

  document.body.appendChild(link);

  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  );

  document.body.removeChild(link);
}

type ExportSessionWrapperProps = PropsWithChildren<{ sessionId: string }>;

function ExportSessionWrapper({
  sessionId,
  children,
}: ExportSessionWrapperProps) {
  const exportMutation = api.sessions.exportSession.useMutation({
    onSuccess: (data) => {
      const dataText = JSON.stringify(data.studentsWhoAnswered, null, 2);
      downloadBlob(new Blob([dataText]), `session-${sessionId}.txt`);
    },
  });
  return (
    <div
      onClick={() =>
        exportMutation.mutate({
          sessionId,
          threshold: 0,
        })
      }
    >
      {children}
    </div>
  );
}

type SessionListItemDropdownProps = PropsWithChildren<{
  sessionId: string;
}>;

export function SessionListItemDropdown({
  sessionId,
  children,
}: SessionListItemDropdownProps) {
  const router = useRouter();
  const deleteMutation = api.sessions.deleteSession.useMutation({
    onSuccess: () => {
      router.refresh();
      toast({
        title: "Success!",
        description: "Session has been deleted",
      });
    },
  });
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <ExportSessionWrapper sessionId={sessionId}>
            <DropdownMenuItem>
              <Download className="mr-2 size-4" />
              Export
            </DropdownMenuItem>
          </ExportSessionWrapper>

          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem>
              <Trash2 className="mr-2 size-4" />
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            session and remove all of its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={() =>
              deleteMutation.mutate({
                sessionId,
              })
            }
            disabled={deleteMutation.isLoading}
            variant="destructive"
            asChild
          >
            <AlertDialogAction>Delete Session</AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
