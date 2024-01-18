"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";

function Home() {
  const session = useSession();
  return (
    <main className="grid h-full place-content-center bg-slate-50">
      <button
        type="button"
        className="rounded-md border-2 border-slate-600 p-3"
        onClick={() => {
          signIn("discord");
        }}
      >
        Sign In
      </button>
      <button
        type="button"
        disabled={session.status !== "authenticated"}
        className="rounded-md border-2 border-slate-600 p-3 disabled:bg-red-200"
        onClick={() => {
          signOut();
        }}
      >
        Sign Out
      </button>
    </main>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <Home />
    </SessionProvider>
  );
}
