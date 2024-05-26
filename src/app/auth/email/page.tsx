"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EmailVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const callbackUrl = searchParams.get("callbackUrl");

  useEffect(() => {
    if (!token || !email || !callbackUrl) return;
    router.replace(
      `/api/auth/callback/email?token=${token}&email=${email}&callbackUrl=${callbackUrl}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!token || !email || !callbackUrl) {
    return <p>Invalid URL</p>;
  }
  return <p>Verifying...</p>;
}
