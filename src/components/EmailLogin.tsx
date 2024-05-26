"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function EmailLogin() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  return (
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
  );
}
