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
import { type Session } from "next-auth";
import { DashboardPageHead } from "@/components/DashboardPageHead";

export const metadata = {
  title: "Dashboard",
};

function AccountDropdownButton({ session }: { session: Session }) {
  return (
    <Button variant="outline" className="mb-2 flex justify-between gap-4">
      <div className="flex items-center gap-2 overflow-hidden">
        <Avatar className="size-6">
          <AvatarImage
            src={session?.user.image ?? ""}
            alt={session?.user.name ?? "Profile image"}
          />
          <AvatarFallback>AF</AvatarFallback>
        </Avatar>
        <div className="basis-full overflow-hidden overflow-ellipsis whitespace-nowrap text-primary">
          {session?.user.displayName ?? session?.user.email}
        </div>
      </div>
      <ChevronDown className="h-4 w-4 text-muted-foreground" />
    </Button>
  );
}

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/?login");
  }
  return (
    <>
      <div className="flex h-full max-sm:flex-col">
        <div className="flex flex-col gap-2 border-r py-6 sm:w-64">
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
              <AccountDropdownButton session={session} />
            </AccountDropdown>
            <Nav />
          </div>
        </div>
        <div className="flex h-full flex-1 flex-col overflow-y-hidden bg-muted">
          <DashboardPageHead />
          <Separator />
          <div className="overflow-y-auto px-8 py-6">{children}</div>
        </div>
      </div>
    </>
  );
}
