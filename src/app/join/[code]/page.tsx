import { OauthButtons } from "@/components/OauthButtons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function JoinCodePage({
  params,
}: {
  params: { code: string };
}) {
  const code = params.code;
  const session = await getServerAuthSession();
  if (session) {
    redirect(`/dashboard?join=${encodeURIComponent(code)}`);
  }
  return (
    <div className="grid h-full place-content-center">
      <Card className="max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login or sign up</CardTitle>
          <CardDescription>
            Enter your email and password or choose a provider below.
          </CardDescription>
        </CardHeader>
        <CardContent className=" flex flex-col gap-4">
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      disabled
                      id="email"
                      type="email"
                      placeholder="mst3k@example.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input disabled id="password" type="password" />
                  </div>
                  <Button disabled className="w-full">
                    Sign in
                  </Button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Email & password accounts are currently disabled. Choose a
                  provider below instead.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex flex-col gap-3">
            <OauthButtons
              redirect={`/dashboard?join=${encodeURIComponent(code)}`}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
