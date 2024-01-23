import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-[30rem] flex-col gap-2 rounded-lg border border-border bg-background px-8 py-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-4 w-48 rounded-full" />
          </div>
          <Separator />
        </div>
        <Skeleton className="mt-auto h-10 w-28" />
      </div>
    </div>
  );
}
