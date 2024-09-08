import { DashboardButton } from "@/components/DashboardButton";
import { ModeToggle } from "@/components/ModeToggle";
import { Separator } from "@/components/ui/separator";
import { Question } from "./Question";
import { api } from "@/trpc/server";
import { getServerAuthSession } from "@/server/auth";
import { QuestionList } from "./QuestionList";
import { EndSessionButton } from "./EndSessionButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function SessionError({ error }: { error?: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-24">
      <div>
        <h1 className="text-center text-6xl font-bold text-primary drop-shadow">
          {error ? "Error" : "Uh oh..."}
        </h1>
        <p className="max-w-md pt-2 text-center text-lg text-muted-foreground">
          {error ?? "Something went wrong."}
        </p>
      </div>

      <Button variant="outline" asChild>
        <Link href="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  );
}

export default async function Session({ params }: { params: { id: string } }) {
  const authSession = await getServerAuthSession();
  if (!authSession) {
    return <SessionError error="Not authorized" />;
  }
  const sessionId = params.id;
  const data = await api.sessions.getSessionInfo.query({
    sessionId: sessionId,
  });
  if (!data) return <SessionError error="Session not found" />;
  const isSessionHost = data.class.ownerUserId === authSession.user?.id;
  if (!isSessionHost) {
    try {
      await api.sessions.joinSessionAsStudent.mutate({
        sessionId: sessionId,
      });
    } catch (e) {
      return <SessionError error="Failed to join session. Try again." />;
    }
  } else {
    try {
      await api.sessions.startSession.mutate({
        sessionId: sessionId,
      });
    } catch (e) {
      return <SessionError error="Failed to start session. Try again." />;
    }
  }
  return (
    <div className="flex h-full flex-col items-center">
      <div className="flex h-20 w-full items-center justify-between gap-2 bg-background px-8 pb-5 pt-6 text-primary max-sm:hidden">
        <div className="flex items-center gap-4">
          <DashboardButton
            href={isSessionHost ? "/dashboard/manage" : "/dashboard"}
          />
          <h1 className="text-2xl font-bold tracking-tight">{data?.title}</h1>
        </div>
        <div className="flex gap-4">
          {isSessionHost && <EndSessionButton sessionId={sessionId} />}
          <ModeToggle />
        </div>
      </div>
      <Separator />
      {isSessionHost ? (
        <QuestionList sessionId={data.id} />
      ) : (
        <div className="-mt-20 grid flex-1 place-content-center">
          <Question sessionId={sessionId} />
        </div>
      )}
    </div>
  );
}
