"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            deleteMutation.mutate({
              classId,
            })
          }
          disabled={deleteMutation.isLoading}
        >
          <Trash2 className="mr-2 size-4" />
          Leave
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
