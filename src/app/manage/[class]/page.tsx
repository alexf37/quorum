import { ModeToggle } from "@/components/ModeToggle";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/server";
import { DashboardButton } from "./DashboardButton";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical } from "lucide-react";
import { NewSessionModal } from "@/components/NewSessionModal";
import { SessionListItemDropdown } from "@/components/SessionListItemDropdown";

type SessionListItemProps = {
  id: string;
  title: string;
  date?: string;
};

function SessionListItem({
  id,
  title,
  date = "Undated",
}: SessionListItemProps) {
  return (
    <li className="flex items-center justify-between rounded-lg border border-border p-4">
      <div className="flex items-center gap-4">
        <div className="h-3 w-3 rounded-full bg-green-500" />
        <div>
          <h3 className="text-md font-medium">{title}</h3>
          <p className="text-xs text-muted-foreground">{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary">View</Button>
        <Button variant="secondary">Edit</Button>
        <SessionListItemDropdown sessionId={id}>
          <MoreVertical className="size-5 text-muted-foreground" />
        </SessionListItemDropdown>
      </div>
    </li>
  );
}

export default async function ManageClass({
  params,
}: {
  params: { class: string };
}) {
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
  return (
    <div>
      <div className="mx-auto flex h-20 max-w-screen-lg items-center gap-2 bg-background px-8 pb-5 pt-6 text-primary max-sm:hidden">
        <div className="flex items-center gap-4">
          <DashboardButton />
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
            <Button className="group">
              <Plus className="mr-2 size-4" />
              New
            </Button>
          </NewSessionModal>
        </div>
        <ul className="flex flex-col gap-2">
          {sessions.map((session) => (
            <SessionListItem
              key={session.id}
              title={session.title}
              id={session.id}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
