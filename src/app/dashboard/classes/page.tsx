import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Plus, MoreHorizontal } from "lucide-react";

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
      <div className="grid-rows-auto grid grid-cols-2 gap-4 px-8 py-6 lg:grid-cols-5">
        {classes.map((clazz, idx) => (
          <Card className="flex aspect-square flex-col" key={idx}>
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
                  <DropdownMenuItem>Leave</DropdownMenuItem>
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
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="grid aspect-square place-content-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-4 hover:bg-slate-100"
            >
              <div className="flex flex-col items-center text-center">
                <Plus strokeWidth={1.5} className="mb-1 size-7" />
                <h3 className="text-lg font-medium">Join a Class</h3>
                {/* <p className="text-sm text-muted-foreground"></p> */}
              </div>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Join a class</DialogTitle>
              <DialogDescription>
                This will add a class to your dashboard. You can leave a class
                at any time.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-4 items-center gap-4">
              <Input placeholder="Enter a class code" className="col-span-3" />
              <Button type="submit">Join</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
