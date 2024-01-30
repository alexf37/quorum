import { ModeToggle } from "@/components/ModeToggle";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/server";
import { DashboardButton } from "@/components/DashboardButton";
import { Button } from "@/components/ui/button";
import { Plus, CalendarOff } from "lucide-react";
import { NewSessionModal } from "@/components/NewSessionModal";
import { SessionListItem } from "@/components/SessionListItem";
import { getServerAuthSession } from "@/server/auth";

export default async function ManageClass({
  params,
}: {
  params: { class: string };
}) {
  const authSession = await getServerAuthSession();
  if (!authSession) {
    return (
      <div>
        <h1>Not authorized</h1>
      </div>
    );
  }
  const clazz = await api.classes.getClassById.query({
    classId: params.class,
  });
  const sessions = await api.sessions.getSessionsByClassId.query({
    classId: params.class,
  });
  if (!clazz.id)
    return (
      <div>
        <h1>Class not found</h1>
      </div>
    );
  if (authSession?.user?.id !== clazz.ownerUserId) {
    return (
      <div>
        <h1>Not authorized</h1>
      </div>
    );
  }
  return (
    <div>
      <div className="mx-auto flex h-20 max-w-screen-lg items-center gap-2 bg-background px-8 pb-5 pt-6 text-primary max-sm:hidden">
        <div className="flex items-center gap-4">
          <DashboardButton href="/dashboard/manage" />
          <h1 className="text-2xl font-bold tracking-tight">{clazz.title}</h1>
        </div>
        <div className="ml-auto">
          <ModeToggle />
        </div>
      </div>
      <Separator />
      <div className="mx-auto flex max-w-screen-lg flex-col gap-4 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="pb-2 text-3xl font-bold text-primary">Sessions</h1>
            <h2 className=" font-medium text-muted-foreground">
              Create and manage sessions
            </h2>
          </div>
          <NewSessionModal classId={clazz.id}>
            <Button>
              <Plus className="mr-2 size-4" />
              New
            </Button>
          </NewSessionModal>
        </div>
        {sessions.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {sessions.map((session) => (
              <SessionListItem
                key={session.id}
                title={session.title}
                id={session.id}
              />
            ))}
          </ul>
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <CalendarOff className="h-10 w-10" />
              </div>
              <h2 className="mt-6 text-xl font-semibold">No sessions</h2>
              <p className="mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground">
                You haven't created any sessions for this class yet.
              </p>
              <NewSessionModal classId={clazz.id}>
                <Button variant="outline">
                  <Plus className="mr-2 size-4" />
                  New session
                </Button>
              </NewSessionModal>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
