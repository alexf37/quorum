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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { OauthButtons } from "./OauthButtons";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export function LoginModal({
  children,
  defaultOpen,
}: PropsWithChildren<{
  defaultOpen?: boolean;
}>) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setMessage("");
            setError("");
            await signIn("email", {
              email,
              redirect: false,
            }).then((res) => {
              if (res?.ok && !res?.error) {
                setEmail("");
                setMessage("Email sent - check your inbox!");
              } else {
                setError("Error sending email - try again?");
              }
            });
          }}
          className="flex flex-col gap-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              type="email"
              placeholder="mst3k@example.com"
            />
          </div>
          <Button className="w-full">Sign in</Button>
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
          {message && (
            <p className="text-center text-sm text-green-500">{message}</p>
          )}
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
        </form>

        <div className="flex flex-col gap-3">
          <OauthButtons />
        </div>
      </DialogContent>
    </Dialog>
  );
}
