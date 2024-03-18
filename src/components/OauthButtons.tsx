"use client";
import { useState } from "react";
import { GithubIcon } from "./icons/GithubIcon";
import { GoogleIcon } from "./icons/GoogleIcon";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

export function OauthButtons({ redirect }: { redirect?: string }) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  return (
    <>
      <Button
        variant="outline"
        disabled={googleLoading}
        onClick={async () => {
          setGoogleLoading(true);
          await signIn("google", { callbackUrl: redirect ?? "/dashboard" });
        }}
      >
        {!googleLoading ? (
          <GoogleIcon className="mr-2 h-4 w-4" />
        ) : (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Google
      </Button>
      <Button
        variant="outline"
        disabled={githubLoading}
        onClick={async () => {
          setGithubLoading(true);
          await signIn("github", { callbackUrl: redirect ?? "/dashboard" });
        }}
      >
        {!githubLoading ? (
          <GithubIcon className="mr-2 h-4 w-4" />
        ) : (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Github
      </Button>
    </>
  );
}
