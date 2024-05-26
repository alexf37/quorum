"use client";
import { type PropsWithChildren } from "react";
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

export function SignUpModal({ children }: PropsWithChildren) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-2xl">Create an account</DialogTitle>
          <DialogDescription>
            Enter your email below to create your account
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
