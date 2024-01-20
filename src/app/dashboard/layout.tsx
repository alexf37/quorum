import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  User,
  ChevronDown,
  Settings,
} from "lucide-react";
import { LogoSvg } from "@/components/LogoSvg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { type PropsWithChildren } from "react";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge";

type NavItemProps = React.PropsWithChildren<{
  active?: boolean;
  href: string;
  className?: string;
}>;

function NavItem({ children, active, href, className }: NavItemProps) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className={twMerge("justify-start", className)}
      asChild
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }
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
                        src={session?.user.image ?? ""}
                        alt="@alexf37"
                      />
                      <AvatarFallback>AF</AvatarFallback>
                    </Avatar>
                    <div className="text-primary">{session?.user.name}</div>
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
                <DropdownMenuItem asChild>
                  <Link href="https://github.com/alexf37">
                    <Github className="mr-2 h-4 w-4" />
                    <span>GitHub</span>
                  </Link>
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
            <div className="flex h-full w-full flex-col gap-2">
              <NavItem href="#" active>
                Overview
              </NavItem>
              <NavItem href="#">Classes</NavItem>
              <NavItem href="#" className="mt-auto">
                <Settings className="mr-2 size-4" />
                Settings
              </NavItem>
            </div>
          </div>
        </div>
        {children}
      </div>
    </>
  );
}
