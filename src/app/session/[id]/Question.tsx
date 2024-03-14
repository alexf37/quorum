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
  CardDescription,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const FormSchema = z.object({
  answer: z
    .string()
    .min(1, {
      message: "Answer must be at least 1 character.",
    })
    .max(500, {
      message: "Answer must be at most 500 characters.",
    }),
});

export function Question({ sessionId }: { sessionId: string }) {
  const { data, isLoading, isSuccess, isError, error, refetch } =
    api.sessions.getCurrentFreeResponseQuestion.useQuery({
      sessionId: sessionId,
      includeAnswer: true,
    });
  const submitFreeResponseAnswerMutation =
    api.sessions.submitFreeResponseAnswer.useMutation({
      onSuccess() {
        toast({
          title: "Success!",
          description: "Submitted your answer.",
        });
      },
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
  useEffect(() => {
    form.reset({
      answer: data?.answers?.[0]?.answer ?? "",
    });
  }, [data, isSuccess, form]);
  function onSubmit(formData: z.infer<typeof FormSchema>) {
    if (isSuccess && data) {
      submitFreeResponseAnswerMutation.mutate({
        sessionId: sessionId,
        questionId: data.id,
        answer: formData.answer,
      });
    }
  }

  return (
    <>
      {isLoading && (
        <div className="flex flex-col items-center gap-2">
          <LoadingSpinner className="mb-2 size-12" />
          <h1 className="text-center text-xl font-semibold text-primary drop-shadow">
            Fetching question...
          </h1>
        </div>
      )}
      {isError && <div>Error: {error?.message}</div>}
      {isSuccess &&
        (data ? (
          <Card className="max-w-prose border-0 pt-2">
            <CardHeader>
              <CardTitle>
                {!data.isLatex ? data.question : <Latex>{data.question}</Latex>}
              </CardTitle>
              <CardDescription>Please answer appropriately.</CardDescription>
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
                        <FormDescription className="pt-2">
                          You may change your answer as many times as you want.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Submit Answer</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <div>No question has been released.</div>
        ))}
    </>
  );
}
