import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { type PropsWithChildren } from "react";

export default function VerifyWithIdLayout({ children }: PropsWithChildren) {
  return (
    <div className="grid h-full w-full place-content-center bg-slate-50">
      <Card className="w-[380px]">
        <CardHeader>
          <CardTitle>Quorum Verification</CardTitle>
          <CardDescription>Verifying Computing ID</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="font-medium text-primary">{children}</div>
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
