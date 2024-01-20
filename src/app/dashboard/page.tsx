"use client";

import { LogoSvg } from "@/components/LogoSvg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Github,
  LifeBuoy,
  LogOut,
  Settings,
  User,
  ChevronDown,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

type NavItemProps = React.PropsWithChildren<{
  active?: boolean;
  href: string;
}>;

function NavItem({ children, active, href }: NavItemProps) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className="justify-start"
      asChild
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}

export default function Dashboard() {
  const session = useSession();
  return (
    <>
      <div className="flex h-full">
        <div className="flex h-full w-64 flex-col items-stretch gap-2 border-r py-6 shadow">
          <Link
            href="/"
            className="flex max-w-screen-sm items-center gap-2 px-8 pb-3 text-primary"
          >
            <LogoSvg className="size-9" />
            <h1 className="text-3xl font-bold tracking-tight">Quorum</h1>
          </Link>
          <Separator className="mb-1" />
          <div className="flex h-full flex-col items-stretch gap-2 px-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="mb-2 flex justify-between gap-4"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarImage
                        src={session.data?.user.image ?? ""}
                        alt="@alexf37"
                      />
                      <AvatarFallback>AF</AvatarFallback>
                    </Avatar>
                    <div className="text-primary">Alex F</div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Github className="mr-2 h-4 w-4" />
                  <span>GitHub</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LifeBuoy className="mr-2 h-4 w-4" />
                  <span>Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <NavItem href="#" active>
              Overview
            </NavItem>
            <NavItem href="#">Classes</NavItem>
          </div>
        </div>
        <div className="h-full flex-1 bg-slate-50">
          <div className="flex items-center gap-2 bg-white px-8 pb-5 pt-6 text-primary">
            <div className="h-9 w-0"></div>
            <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          </div>
          <Separator />
        </div>
      </div>
    </>
  );
}
