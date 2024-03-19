import { LogoSvg } from "@/components/LogoSvg";
import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";
import { AuthButton } from "@/components/AuthButton";
import { Separator } from "@/components/ui/separator";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { SignUpModal } from "@/components/SignUpModal";
import { ModeToggle } from "@/components/ModeToggle";
import { LandingForm } from "./LandingForm";
import Pricing from "@/app/pricing/page";

async function AuthButtons() {
  const session = await getServerAuthSession();
  return (
    <>
      <AuthButton authed={!!session} />
      {!session ? (
        <SignUpModal>
          <Button type="button">Sign Up</Button>
        </SignUpModal>
      ) : (
        <Button type="button" asChild>
          <Link href="dashboard">Dashboard</Link>
        </Button>
      )}
      <ModeToggle />
    </>
  );
}

function NavBar() {
  return (
    <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between gap-4 px-8 py-6">
      <div className="flex max-w-screen-sm items-center gap-2 text-primary">
        <LogoSvg className="size-9" />
        <h1 className="text-3xl font-bold tracking-tight max-sm:hidden">
          Quorum
        </h1>
        <nav className="-mb-0.5 flex items-center gap-8 pl-10 text-sm tracking-wide text-muted-foreground">
          <Link className="transition-all hover:text-foreground" href="#">
            Home
          </Link>
          <Link
            className="transition-all hover:text-foreground"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="transition-all hover:text-foreground"
            href="#pricing"
          >
            Pricing
          </Link>
        </nav>
      </div>
      <div className="flex gap-2">
        <AuthButtons />
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div className="mb-24 mt-8 flex flex-col items-center px-8 py-36">
      <h1 className="text-center text-6xl font-bold text-primary drop-shadow lg:text-7xl">
        Meet Quorum
      </h1>
      <p className="max-w-md pt-3 text-center text-lg text-muted-foreground lg:text-xl">
        Your dedicated platform for real-time polling, discussion, and
        visualisation.
      </p>
      <LandingForm />
    </div>
  );
}

function Footer() {
  return (
    <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between gap-4 bg-background px-8 py-6 text-muted-foreground">
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
    <div className="space-y-16 pb-24">
      <div>
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Features
          </h2>
        </div>
        <p className="mx-auto mt-6 max-w-2xl px-8 text-center text-lg leading-8 text-muted-foreground">
          Quorum offers everything you need to implement live, interactive,
          easy-to-use polls in your classroom or organization.
        </p>
      </div>
      <div className="mx-auto flex max-w-screen-lg justify-center gap-8 px-16 max-sm:flex-col">
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
            Quorum tracks student participation, helping you identify students
            who may be struggling, and helping you understand how your students
            are engaging with the material.
          </p>
        </div>
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
      className="absolute inset-0 -z-10 h-full w-full stroke-border [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
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
    <div className="relative isolate flex h-full flex-col overflow-x-hidden bg-background">
      <BackgroundGraphic />
      <NavBar />
      <Hero />
      <Features />
      <Pricing />
      <Separator className="mt-auto" />
      <Footer />
    </div>
  );
}
