"use client";
import { GithubIcon } from "./icons/GithubIcon";
import { GoogleIcon } from "./icons/GoogleIcon";
import { DiscordIcon } from "./icons/DiscordIcon";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export function OauthButtons() {
  return (
    <>
      <Button
        variant="outline"
        onClick={() => {
          void signIn("google", { callbackUrl: "/dashboard" });
        }}
      >
        <GoogleIcon className="mr-2 h-4 w-4" />
        Google
      </Button>
      <Button
        variant="outline"
        onClick={async () => {
          await signIn("discord", { callbackUrl: "/dashboard" });
        }}
      >
        <DiscordIcon className="mr-2 h-4 w-4" />
        Discord
      </Button>
      <Button
        variant="outline"
        onClick={async () => {
          await signIn("github", { callbackUrl: "/dashboard" });
        }}
      >
        <GithubIcon className="mr-2 h-4 w-4" />
        Github
      </Button>
    </>
  );
}
