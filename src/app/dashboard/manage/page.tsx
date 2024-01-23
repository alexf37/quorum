import { CreateClassModal } from "@/components/CreateClassModal";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/server";
import { Plus, MoreHorizontal, Trash2 } from "lucide-react";

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
          className="flex basis-full flex-col sm:aspect-square sm:h-full sm:max-w-56"
          key={idx}
        >
          <div
            className={`flex h-10 items-center justify-end rounded-t-lg px-4 text-secondary ${twRainbow[idx % twRainbow.length]}`}
          >
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreHorizontal />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="mr-2 size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Separator />
          <CardHeader>
            <CardTitle>{clazz.courseCode}</CardTitle>
            <CardDescription>{clazz.title}</CardDescription>
          </CardHeader>
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
