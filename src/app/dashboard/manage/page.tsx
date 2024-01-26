import { CreateClassModal } from "@/components/CreateClassModal";
import { OwnedClassCardDropdown } from "@/components/OwnedClassCardDropdown";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/server";
import { Plus, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Manage Classes",
};

const twRainbow = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-purple-500",
];

const twDarkRainbow = [
  "bg-red-500 dark:bg-red-700",
  "bg-orange-500 dark:bg-orange-700",
  "bg-yellow-500 dark:bg-yellow-700",
  "bg-green-500 dark:bg-green-700",
  "bg-blue-500 dark:bg-blue-700",
  "bg-purple-500 dark:bg-purple-700",
];

export default async function Manage() {
  const classes = await api.classes.getOwnedClasses.query();

  return (
    <div className="flex w-full flex-wrap gap-4 max-sm:justify-center">
      {classes.map((clazz, idx) => (
        <Card
          key={clazz.id}
          className="flex basis-full flex-col transition-all hover:-translate-y-1 hover:cursor-pointer hover:opacity-70 sm:aspect-square sm:h-full sm:max-w-56"
        >
          <Link className="h-full w-full" href={`/manage/${clazz.id}`}>
            <div
              className={`flex h-10 items-center justify-end rounded-t-lg px-4 text-secondary ${twRainbow[idx % twRainbow.length]}`}
            >
              <OwnedClassCardDropdown classId={clazz.id}>
                <MoreHorizontal className="" />
              </OwnedClassCardDropdown>
            </div>
            <Separator />
            <CardHeader>
              <CardTitle>{clazz.courseCode}</CardTitle>
              <CardDescription>{clazz.title}</CardDescription>
            </CardHeader>
          </Link>
        </Card>
      ))}
      <CreateClassModal>
        <button
          type="button"
          className="grid basis-full flex-col place-content-center rounded-lg border-2 border-dashed border-slate-300 bg-muted p-4 hover:opacity-50 max-sm:h-48 sm:aspect-square sm:h-full sm:max-w-56"
        >
          <div className="flex flex-col items-center text-center">
            <Plus strokeWidth={1.5} className="mb-1 size-7" />
            <h3 className="text-lg font-medium">Create a Class</h3>
            {/* <p className="text-sm text-muted-foreground"></p> */}
          </div>
        </button>
      </CreateClassModal>
    </div>
  );
}
