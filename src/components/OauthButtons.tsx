"use client";
import { GithubIcon } from "./icons/GithubIcon";
import { GoogleIcon } from "./icons/GoogleIcon";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export function OauthButtons({ redirect }: { redirect?: string }) {
  return (
    <>
      <Button
        variant="outline"
        onClick={async () => {
          await signIn("google", { callbackUrl: redirect ?? "/dashboard" });
        }}
      >
        <GoogleIcon className="mr-2 h-4 w-4" />
        Google
      </Button>
      <Button
        variant="outline"
        onClick={async () => {
          await signIn("github", { callbackUrl: redirect ?? "/dashboard" });
        }}
      >
        <GithubIcon className="mr-2 h-4 w-4" />
        Github
      </Button>
    </>
  );
}
