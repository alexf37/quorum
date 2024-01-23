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
import { api } from "@/trpc/react";
import { Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { type PropsWithChildren } from "react";
import { useRouter } from "next/navigation";

type OwnedClassCardDropdownProps = PropsWithChildren<{
  classId: string;
}>;

export function OwnedClassCardDropdown({
  children,
  classId,
}: OwnedClassCardDropdownProps) {
  const router = useRouter();
  const deleteMutation = api.classes.deleteClass.useMutation({
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You have deleted this class.",
      });
      router.refresh();
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        className: "border-destructive",
      });
    },
  });
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Options</DropdownMenuLabel>
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
            class and remove all of its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={() =>
              deleteMutation.mutate({
                classId,
              })
            }
            disabled={deleteMutation.isLoading}
            variant="destructive"
            asChild
          >
            <AlertDialogAction>Delete Class</AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
