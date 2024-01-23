import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CardHeader } from "@/components/ui/card";

function ClassCardSkeleton() {
  return (
    <Skeleton className="flex basis-full flex-col bg-background sm:aspect-square sm:h-full sm:max-w-56">
      <Skeleton className="flex h-10 items-center justify-end rounded-b-none rounded-t-lg bg-background px-4 text-secondary">
        <MoreHorizontal />
      </Skeleton>
      <Separator />
      <CardHeader className="flex flex-col gap-2">
        <Skeleton className="h-6 w-28 rounded-full" />
        <Skeleton className="mt-8 h-4 w-36 rounded-full" />
      </CardHeader>
    </Skeleton>
  );
}

export default function ClassesLoading() {
  return (
    <div className="flex w-full flex-wrap gap-4 max-sm:justify-center">
      <ClassCardSkeleton />
      <ClassCardSkeleton />
      <ClassCardSkeleton />
    </div>
  );
}
