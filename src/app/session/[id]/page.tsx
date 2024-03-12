import { DashboardButton } from "@/components/DashboardButton";
import { ModeToggle } from "@/components/ModeToggle";
import { Separator } from "@/components/ui/separator";
import { Question } from "./Question";
import { api } from "@/trpc/server";
import { getServerAuthSession } from "@/server/auth";
import { QuestionList } from "./QuestionList";
import { EndSessionButton } from "./EndSessionButton";

const cause = {
  cause: "controlled error",
};

export default async function Session({ params }: { params: { id: string } }) {
  const authSession = await getServerAuthSession();
  if (!authSession) {
    throw (new Error("Not authorized"), cause);
  }
  const sessionId = params.id;
  const data = await api.sessions.getSessionInfo.query({
    sessionId: sessionId,
  });
  if (!data) throw new Error("Session not found", cause);
  const isSessionHost = data.hostUserId === authSession.user?.id;
  if (!isSessionHost) {
    try {
      await api.sessions.joinSessionAsStudent.mutate({
        sessionId: sessionId,
      });
    } catch (e) {
      throw new Error("Failed to join session. Try again.", cause);
    }
  } else {
    try {
      await api.sessions.startSession.mutate({
        sessionId: sessionId,
      });
    } catch (e) {
      throw new Error("Failed to start session. Try again.", cause);
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
