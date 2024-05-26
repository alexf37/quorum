"use client";

import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

export default function EmailVerificationPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const callbackUrl = searchParams.get("callbackUrl");

  if (!token || !email || !callbackUrl) {
    return <p>Invalid URL</p>;
  }

  if (typeof window === "undefined") {
    return <p>No browser detected.</p>;
  }

  return (
    <div className="grid h-full place-content-center">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">One more step...</h1>
        <p className="max-w-sm text-muted-foreground">
          Click the button below to login. <br /> You will stay logged in for 30
          days.
        </p>
      </div>
      <form
        className="mx-auto mt-4"
        method="GET"
        action={`/api/auth/callback/email?token=${token}&email=${email}&callbackUrl=${callbackUrl}`}
      >
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <input type="hidden" name="email" value={email} />
        <Button>Login to Quorum</Button>
      </form>
    </div>
  );
}
