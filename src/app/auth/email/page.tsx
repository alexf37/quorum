"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

export default function EmailVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const callbackUrl = searchParams.get("callbackUrl");

  if (!token || !email || !callbackUrl) {
    return <p>Invalid URL</p>;
  }
  return (
    <div className="grid h-full place-content-center">
      <Button
        type="button"
        onClick={() => {
          router.replace(
            `/api/auth/callback/email?token=${token}&email=${email}&callbackUrl=${callbackUrl}`,
          );
        }}
      >
        Click to Login
      </Button>
    </div>
  );
}
