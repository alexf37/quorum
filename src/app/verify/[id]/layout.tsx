import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { type PropsWithChildren } from "react";

export default function VerifyWithIdLayout({ children }: PropsWithChildren) {
  return (
    <div className="bg-backround grid h-full w-full place-content-center">
      <Card className="w-[380px]">
        <CardHeader>
          <CardTitle>Quorum Verification</CardTitle>
          <CardDescription>Verifying Computing ID</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="font-medium text-primary">{children}</div>
          <Button asChild>
            <Link href="/">Go to Homepage</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
