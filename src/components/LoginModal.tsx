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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LoginModal({
  children,
  defaultOpen,
}: PropsWithChildren<{
  defaultOpen?: boolean;
}>) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(!!defaultOpen);
  }, [defaultOpen]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-2xl">Login</DialogTitle>
          <DialogDescription>
            Enter your email and password below to login
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            const res = await signIn("credentials", {
              email,
              password,
              redirect: false,
              callbackUrl: "/dashboard",
            });
            if (!res) {
              setError("An error occurred");
              setLoading(false);
            } else if (!res.error) {
              router.refresh();
              location.href = "/dashboard";
            } else {
              setError(res.error);
              setLoading(false);
            }
          }}
          className="flex flex-col gap-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              id="email"
              type="email"
              placeholder="mst3k@example.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              id="password"
              type="password"
            />
          </div>
          <div className="text-sm text-destructive">{error}</div>
          <Button disabled={loading} className="w-full">
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
        </form>

        <div className="flex flex-col gap-3">
          <OauthButtons />
        </div>
      </DialogContent>
    </Dialog>
  );
}
