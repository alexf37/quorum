import { LogoSvg } from "@/components/LogoSvg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";
import { AuthButton } from "./AuthButton";

async function AuthButtons() {
  const session = await getServerAuthSession();
  return (
    <>
      <AuthButton authed={!!session} />
      {!session ? (
        <Button type="button">Sign Up</Button>
      ) : (
        <Button type="button" asChild>
          <Link href="dashboard">Dashboard</Link>
        </Button>
      )}
    </>
  );
}

function NavBar() {
  return (
    <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-4 px-8 py-6">
      <div className="flex max-w-screen-sm items-center gap-2 text-primary">
        <LogoSvg className="size-9" />
        <h1 className="text-3xl font-bold tracking-tight">Quorum</h1>
      </div>
      <div className="flex gap-2">
        <AuthButtons />
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div className="flex flex-col items-center py-24">
      <h1 className="text-center text-6xl font-bold text-primary drop-shadow">
        Meet Quorum
      </h1>
      <p className="max-w-md pt-3 text-center text-lg text-muted-foreground">
        Your homegrown, open-source platform for real-time polling, discussion,
        and visualisation.
      </p>
      <div className="flex w-full max-w-xs items-center space-x-2 pt-6">
        <Input type="text" placeholder="Computing ID" />
        <Button type="button">Join Class</Button>
      </div>
      <small className="pt-2 text-slate-400">
        If you're managing a class,{" "}
        <Link href="#" className="underline hover:text-primary">
          click here
        </Link>{" "}
        instead.
      </small>
    </div>
  );
}

export default function App() {
  return (
    <div className="relative isolate h-full overflow-hidden bg-background">
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
  );
}
