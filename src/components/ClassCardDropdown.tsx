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
import { LogOut } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { type PropsWithChildren } from "react";
import { useRouter } from "next/navigation";

type ClassCardDropdownProps = PropsWithChildren<{
  classId: string;
}>;

export function ClassCardDropdown({
  children,
  classId,
}: ClassCardDropdownProps) {
  const router = useRouter();
  const leaveMutation = api.classes.leaveClass.useMutation({
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You have left the class.",
      });
      router.refresh();
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
            leaveMutation.mutate({
              classId,
            })
          }
          disabled={leaveMutation.isLoading}
        >
          <LogOut className="mr-2 size-4" />
          Leave
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
