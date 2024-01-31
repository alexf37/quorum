import { DashboardButton } from "@/components/DashboardButton";
import { ModeToggle } from "@/components/ModeToggle";
import { Separator } from "@/components/ui/separator";
import { Question } from "./Question";
import { api } from "@/trpc/server";
import { getServerAuthSession } from "@/server/auth";
import { QuestionList } from "./QuestionList";

export default async function Session({ params }: { params: { id: string } }) {
  const authSession = await getServerAuthSession();
  if (!authSession) {
    return (
      <div>
        <h1>Not authorized</h1>
      </div>
    );
  }
  const sessionId = params.id;
  const data = await api.sessions.getSessionInfo.query({
    sessionId: sessionId,
  });
  if (!data) return <div>Session not found</div>;
  const isSessionHost = data.hostUserId === authSession.user?.id;
  return (
    <div className="flex h-full flex-col items-center">
      <div className="grid h-20 w-full grid-cols-12 items-center gap-2 bg-background px-8 pb-5 pt-6 text-primary max-sm:hidden">
        <div className=" col-span-6 flex items-center gap-4">
          <DashboardButton href="/dashboard" />
          <h1 className="text-2xl font-bold tracking-tight">{data?.title}</h1>
        </div>
        <div className="col-start-12 ml-auto">
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
