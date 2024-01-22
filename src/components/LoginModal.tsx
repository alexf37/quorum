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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { OauthButtons } from "./OauthButtons";
import { Button } from "@/components/ui/button";

export function LoginModal({ children }: PropsWithChildren) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-2xl">Login</DialogTitle>
          <DialogDescription>
            Enter your email and password below to login
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input disabled id="email" type="email" placeholder="m@example.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input disabled id="password" type="password" />
        </div>
        <Button className="w-full">Login</Button>
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
        <div className="flex flex-col gap-3">
          <OauthButtons />
        </div>
      </DialogContent>
    </Dialog>
  );
}
