import { EmailLogin } from "@/components/EmailLogin";
import { OauthButtons } from "@/components/OauthButtons";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
            Enter your email or choose a provider below.
          </CardDescription>
        </CardHeader>
        <CardContent className=" flex flex-col gap-4">
          <EmailLogin />

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
