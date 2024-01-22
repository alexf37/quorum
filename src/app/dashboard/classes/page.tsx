import { JoinClassModal } from "@/components/JoinClassModal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
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
import { Plus, MoreHorizontal, LogOut } from "lucide-react";

const twRainbow = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-purple-500",
];

const classes = [
  {
    name: "CS 3100",
    description: "Data Structures & Algorithms II",
  },
  {
    name: "EVSC 2800",
    description: "Fundamentals of Geology",
  },
  {
    name: "APMA 3100",
    description: "Probability",
  },
  {
    name: "CS 2120",
    description: "Discrete Math 1",
  },
] as const;

export default function Classes() {
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
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreHorizontal />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 size-4" />
                    Leave
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Separator />
            <CardHeader>
              <CardTitle>{clazz.name}</CardTitle>
              <CardDescription>{clazz.description}</CardDescription>
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
