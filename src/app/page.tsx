import Link from "next/link";

import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";

export default async function Home() {
  return <main className="grid place-content-center bg-slate-50">Hi</main>;
}
