import { DashboardButton } from "@/components/DashboardButton";
import { ModeToggle } from "@/components/ModeToggle";
import { Separator } from "@/components/ui/separator";
import { Question } from "./Question";
import { api } from "@/trpc/server";

export default async function Session({ params }: { params: { id: string } }) {
  const sessionId = params.id;
  const data = await api.sessions.getSessionInfo.query({
    sessionId: sessionId,
  });
  if (!data) return <div>Session not found</div>;
  return (
    <div className="flex h-full flex-col items-center">
      <div className="flex h-20 w-full max-w-screen-lg items-center gap-2 bg-background px-8 pb-5 pt-6 text-primary max-sm:hidden">
        <div className="flex items-center gap-4">
          <DashboardButton href="/dashboard" />
          <h1 className="text-2xl font-bold tracking-tight">{data?.title}</h1>
        </div>
        <div className="ml-auto">
          <ModeToggle />
        </div>
      </div>
      <Separator />
      <div className="-mt-20 grid flex-1 place-content-center">
        <Question sessionId={sessionId} />
      </div>
    </div>
  );
}
