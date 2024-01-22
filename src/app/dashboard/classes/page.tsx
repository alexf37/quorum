import { JoinClassModal } from "@/components/JoinClassModal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { Plus, MoreHorizontal } from "lucide-react";
import { api } from "@/trpc/server";
import { ClassCardDropdown } from "@/components/ClassCardDropdown";

const twRainbow = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-purple-500",
];

export default async function Classes() {
  const classes = await api.classes.getJoinedClasses.query();
  return (
    <div className="h-full flex-1 bg-slate-50">
      <div className="flex items-center gap-2 bg-white px-8 pb-5 pt-6 text-primary max-sm:hidden">
        <div className="h-9 w-0"></div>
        <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
      </div>
      <Separator />
      <div className="flex w-full flex-wrap gap-4 px-8 py-6 max-sm:justify-center">
        {classes.map((clazz, idx) => (
          <Card
            className="flex basis-full flex-col sm:aspect-square sm:h-full sm:max-w-56"
            key={idx}
          >
            <div
              className={`flex h-10 items-center justify-end rounded-t-lg px-4 text-secondary ${twRainbow[idx % twRainbow.length]}`}
            >
              <ClassCardDropdown classId={clazz.id}>
                <MoreHorizontal />
              </ClassCardDropdown>
            </div>
            <Separator />
            <CardHeader>
              <CardTitle>{clazz.courseCode}</CardTitle>
              <CardDescription>{clazz.title}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto grid w-full grid-cols-2 gap-2">
              <Button variant="secondary">View</Button>
              <Button variant="outline">Join</Button>
            </CardFooter>
          </Card>
        ))}
        <JoinClassModal>
          <button
            type="button"
            className="grid basis-full flex-col place-content-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-4 hover:bg-slate-100 max-sm:h-48 sm:aspect-square sm:h-full sm:max-w-56"
          >
            <div className="flex flex-col items-center text-center">
              <Plus strokeWidth={1.5} className="mb-1 size-7" />
              <h3 className="text-lg font-medium">Join a Class</h3>
              {/* <p className="text-sm text-muted-foreground"></p> */}
            </div>
          </button>
        </JoinClassModal>
      </div>
    </div>
  );
}
