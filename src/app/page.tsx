import { LogoSvg } from "@/components/LogoSvg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";
import { AuthButton } from "@/components/AuthButton";
import { Separator } from "@/components/ui/separator";
import { GithubIcon } from "@/components/GithubIcon";

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
        <h1 className="text-3xl font-bold tracking-tight max-sm:hidden">
          Quorum
        </h1>
      </div>
      <div className="flex gap-2">
        <AuthButtons />
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div className="flex flex-col items-center px-8 py-28">
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

function Footer() {
  return (
    <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-4 bg-white px-8 py-6 text-muted-foreground">
      <small>© 2024 Alex Foster. All rights reserved.</small>
      <div className="flex gap-2">
        <a href="https://github.com/alexf37" className="hover:text-primary">
          <GithubIcon className="size-6" />
        </a>
      </div>
    </div>
  );
}

function Features() {
  return (
    <div className="mx-auto flex max-w-screen-lg justify-center gap-8 px-16 py-24 max-sm:flex-col">
      <div className="w-full space-y-3">
        <h2 className="text-2xl font-semibold text-primary">
          Boost Engagement
        </h2>
        <p>
          Quorum creates an interactive and dynamic learning environment,
          helping educators and students connect more effectively, fostering
          collaboration, and enhancing the educational experience.
        </p>
      </div>
      <div className="w-full space-y-3">
        <h2 className="text-2xl font-semibold text-primary">
          Real-time Feedback
        </h2>
        <p>
          Instant, live poll results show you how your students are doing, and
          help you identify areas of confusion and misunderstanding.
        </p>
      </div>
      <div className="w-full space-y-3">
        <h2 className="text-2xl font-semibold text-primary">
          Track Participation
        </h2>
        <p>
          Quorum tracks student participation, helping you identify students who
          may be struggling, and helping you understand how your students are
          engaging with the material.
        </p>
      </div>
    </div>
  );
}

/**
 *  Requires a parent element with `position: relative`
 */
function BackgroundGraphic() {
  return (
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
  );
}

export default function App() {
  return (
    <div className="relative isolate h-full overflow-x-hidden bg-background">
      <BackgroundGraphic />
      <NavBar />
      <Hero />
      <Features />
      <Separator />
      <Footer />
    </div>
  );
}
