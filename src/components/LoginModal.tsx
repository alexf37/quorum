"use client";
import { useState, type PropsWithChildren, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { OauthButtons } from "./OauthButtons";
import { EmailLogin } from "./EmailLogin";

export function LoginModal({
  children,
  defaultOpen,
}: PropsWithChildren<{
  defaultOpen?: boolean;
}>) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(!!defaultOpen);
  }, [defaultOpen]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-2xl">Login</DialogTitle>
          <DialogDescription>
            Enter your email below to login to your account.
          </DialogDescription>
        </DialogHeader>

        <EmailLogin />

        <div className="flex flex-col gap-3">
          <OauthButtons />
        </div>
      </DialogContent>
    </Dialog>
  );
}
