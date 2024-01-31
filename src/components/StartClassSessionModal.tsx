import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

import { api } from "@/trpc/server";
import { type PropsWithChildren } from "react";
import Link from "next/link";

type StartClassSessionModalProps = PropsWithChildren<{
  classId: string;
}>;
export async function StartClassSessionModal({
  classId,
  children,
}: StartClassSessionModalProps) {
  const sessions = await api.sessions.getSessionsByClassId.query({
    classId: classId,
  });
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start Session</DialogTitle>
          <DialogDescription>
            Choose the session you would like to start from the list below.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-72 rounded-md border">
          {sessions.length > 0 ? (
            <ul className="divide-y">
              {sessions.map((session) => (
                <li key={session.id} className="group py-3 hover:bg-muted">
                  <div className="flex items-center justify-between gap-4 px-4">
                    <div>{session.title}</div>

                    {session.status === "ONGOING" && (
                      <div className="text-muted-foreground group-hover:hidden">
                        Ongoing
                      </div>
                    )}
                    <Button
                      variant="link"
                      className="hidden h-min p-0 group-hover:flex"
                      asChild
                    >
                      <Link href={`/session/${session.id}`}>
                        {session.status === "ONGOING" ? "Rejoin" : "Start"}
                        <ChevronRight className="ml-2 size-4" />
                      </Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No sessions found
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
