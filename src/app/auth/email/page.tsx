"use client";

import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function useDelayedRender() {
  const [render, setRender] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setRender(true);
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);
  return render;
}

export default function EmailVerificationPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const callbackUrl = searchParams.get("callbackUrl");

  //   const shouldRender = useDelayedRender();

  if (!token || !email || !callbackUrl) {
    return <p>Invalid URL</p>;
  }

  if (window === undefined) {
    return <p>No browser detected.</p>;
  }

  //   if (!shouldRender) {
  //     return <p>Checking if you're human...</p>;
  //   }
  return (
    <div className="grid h-full place-content-center">
      <form
        method="GET"
        action={`/api/auth/callback/email?token=${token}&email=${email}&callbackUrl=${callbackUrl}`}
      >
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <input type="hidden" name="email" value={email} />
        <Button>Click to Login</Button>
      </form>
    </div>
  );
}
