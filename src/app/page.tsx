"use client";
import { LogoSvg } from "@/components/LogoSvg";
import { signIn, signOut, useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";

function AuthButtons() {
  const session = useSession();
  return (
    <>
      <button
        type="button"
        className="rounded-md border-2 border-slate-600 p-3"
        onClick={async () => {
          await signIn("discord");
        }}
      >
        Sign In
      </button>
      <button
        type="button"
        disabled={session.status !== "authenticated"}
        className="rounded-md border-2 border-slate-600 p-3 disabled:bg-red-200"
        onClick={async () => {
          await signOut();
        }}
      >
        Sign Out
      </button>
    </>
  );
}

function NavBar() {
  return (
    <div className="text-primary flex max-w-screen-sm items-center gap-2 px-8 py-6">
      <LogoSvg className="size-9" />
      <h1 className="text-3xl font-bold tracking-tight">Quorum</h1>
    </div>
  );
}

function Hero() {
  return (
    <div className="flex flex-col items-center py-24">
      <h1 className="text-primary text-center text-6xl font-bold drop-shadow">
        Meet Quorum
      </h1>
      <p className="text-muted-foreground max-w-md pt-3 text-center text-lg">
        Your homegrown, open-source platform for real-time polling, discussion,
        and visualisation.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <div className="bg-background relative isolate h-full overflow-hidden">
        <svg
          className="absolute inset-0 -z-10 h-full w-full stroke-slate-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="grid-pattern"
              width={150}
              height={150}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#grid-pattern)"
          />
        </svg>
        <NavBar />
        <Hero />
      </div>
    </SessionProvider>
  );
}
