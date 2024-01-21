import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { LogoSvg } from "@/components/LogoSvg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { type PropsWithChildren } from "react";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Nav } from "@/components/Nav";
import { AccountDropdown } from "@/components/AccountDropdown";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }
  return (
    <>
      <div className="flex h-full">
        <div className="flex w-64 flex-col gap-2 border-r py-6">
          <Link
            href="/"
            className="flex max-w-screen-sm items-center gap-2 px-8 pb-3 text-primary"
          >
            <LogoSvg className="size-9" />
            <h1 className="text-3xl font-bold tracking-tight">Quorum</h1>
          </Link>
          <Separator className="mb-1" />
          <div className="flex h-full flex-col items-stretch gap-2 px-6">
            <AccountDropdown>
              <Button
                variant="outline"
                className="mb-2 flex justify-between gap-4"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="size-6">
                    <AvatarImage
                      src={session?.user.image ?? ""}
                      alt="@alexf37"
                    />
                    <AvatarFallback>AF</AvatarFallback>
                  </Avatar>
                  <div className="text-primary">{session?.user.name}</div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </AccountDropdown>
            <Nav />
          </div>
        </div>
        {children}
      </div>
    </>
  );
}
