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
import { Plus, MoreHorizontal, HeartCrack } from "lucide-react";
import { api } from "@/trpc/server";
import { ClassCardDropdown } from "@/components/ClassCardDropdown";
import Link from "next/link";
import { RefreshButton } from "./RefreshButton";

export const metadata = {
  title: "Classes",
};

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
    <div className="flex w-full flex-wrap gap-4 max-sm:justify-center">
      {classes.length === 0 && (
        <div className="pointer-events-none absolute inset-0 grid h-full w-full place-content-center">
          <div className="pointer-events-auto mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <HeartCrack className="h-10 w-10" />
            </div>
            <h2 className="mt-2 text-2xl font-semibold">No classes</h2>
            <p className="text-md mb-6 mt-2 text-center font-normal leading-6 text-muted-foreground">
              You haven't joined any classes yet.
            </p>
            <JoinClassModal>
              <Button className="text-md" variant="outline">
                <Plus className="mr-2 size-4" />
                Join a class
              </Button>
            </JoinClassModal>
          </div>
        </div>
      )}
      {classes.length > 0 && (
        <>
          {classes.map((clazz, idx) => (
            <Card
              className="flex basis-full flex-col sm:aspect-square sm:h-full sm:max-w-56"
              key={idx}
            >
              <div
                className={`flex h-10 items-center justify-end rounded-t-lg px-4 text-secondary ${twRainbow[idx % twRainbow.length]}`}
              >
                <ClassCardDropdown classId={clazz.id}>
                  <MoreHorizontal className="" />
                </ClassCardDropdown>
              </div>
              <Separator />
              <CardHeader>
                <CardTitle>{clazz.courseCode}</CardTitle>
                <CardDescription>{clazz.title}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto grid w-full grid-cols-2 gap-2">
                {clazz.classSession ? (
                  <Button variant="outline" className="col-span-2" asChild>
                    <Link href={`/session/${clazz.classSession.id}`}>
                      Join Session
                    </Link>
                  </Button>
                ) : (
                  <Button variant="ghost" className="group col-span-2" asChild>
                    <RefreshButton>
                      <div className="text-muted-foreground opacity-100 transition-all group-hover:hidden group-hover:opacity-0">
                        No Ongoing Session
                      </div>
                      <div className="hidden text-primary opacity-0 transition-all group-hover:block group-hover:opacity-100">
                        Refresh
                      </div>
                    </RefreshButton>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
          <JoinClassModal>
            <button
              type="button"
              className="grid basis-full flex-col place-content-center rounded-lg border-2 border-dashed border-slate-300 bg-muted p-4 hover:opacity-50 max-sm:h-48 sm:aspect-square sm:h-full sm:max-w-56"
            >
              <div className="flex flex-col items-center text-center">
                <Plus strokeWidth={1.5} className="mb-1 size-7" />
                <h3 className="text-lg font-medium">Join a Class</h3>
                {/* <p className="text-sm text-muted-foreground"></p> */}
              </div>
            </button>
          </JoinClassModal>
        </>
      )}
    </div>
  );
}
