"use client";

import { useXssSocketListener } from "@/lib/useXssSocketListener";
import { api } from "@/trpc/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  answer: z.string().min(1, {
    message: "Username must be at least 1 character.",
  }),
});

export function Question({ sessionId }: { sessionId: string }) {
  const { data, isLoading, isSuccess, isError, error, refetch } =
    api.sessions.getCurrentFreeResponseQuestion.useQuery({
      sessionId: sessionId,
    });
  useXssSocketListener({
    channel: `quorum-listen-${sessionId ?? "waiting"}`,
    onData: (sender, data) => {
      console.log("Received data from", sender, ":", data);
      void refetch();
    },
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      answer: "",
    },
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error: {error?.message}</div>}
      {isSuccess &&
        (data ? (
          <Card className="border-0 pt-2">
            <CardHeader>
              <CardTitle>{`${data.question}`}</CardTitle>
              <CardDescription>
                Please answer in just a few sentences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="answer"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormLabel className="sr-only">Answer</FormLabel>
                        <FormControl>
                          <Input placeholder="Answer here..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Submit Answer</Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        ) : (
          <div>Question does not exist.</div>
        ))}
    </>
  );
}
