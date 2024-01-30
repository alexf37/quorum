import { ModeToggle } from "@/components/ModeToggle";
import { DashboardButton } from "@/components/DashboardButton";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { MoreVertical } from "lucide-react";

function SessionListItemSkeleton() {
  return (
    <Skeleton className="flex flex-col rounded-lg border border-border bg-background p-4 pb-2">
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-4">
          <div className="h-3 w-3 rounded-full bg-muted" />
          <div className="space-y-1">
            <Skeleton className="w-40  text-sm font-medium text-transparent">
              Session
            </Skeleton>
            <Skeleton className="w-20  text-xs text-transparent">
              Undated
            </Skeleton>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 px-4 py-2 text-sm text-transparent">
            View
          </Skeleton>
          <Skeleton className="h-10 px-4 py-2 text-sm text-transparent">
            Edit
          </Skeleton>
          <MoreVertical className="size-5 text-muted" />
        </div>
      </div>
    </Skeleton>
  );
}

export default function ManageClassLoading() {
  return (
    <div>
      <div className="mx-auto flex h-20 max-w-screen-lg items-center gap-2 bg-background px-8 pb-5 pt-6 text-primary max-sm:hidden">
        <div className="flex items-center gap-4">
          <DashboardButton href="/dashboard/manage" />
          <Skeleton className="text-2xl font-bold tracking-tight text-transparent">
            Loading class...
          </Skeleton>
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
          <Skeleton className="h-10 w-20 bg-accent px-4 py-2 text-transparent">
            <div className="mr-2 size-4" />
            New
          </Skeleton>
        </div>
        <ul className="flex flex-col gap-2">
          <SessionListItemSkeleton />
          <SessionListItemSkeleton />
          <SessionListItemSkeleton />
        </ul>
      </div>
    </div>
  );
}
