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
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

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
  const utils = api.useUtils();
  const { data, isLoading, isSuccess, isError, error, refetch } =
    api.sessions.getCurrentFreeResponseQuestion.useQuery({
      sessionId: sessionId,
      includeAnswer: true,
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
  const submitFreeResponseAnswerMutation =
    api.sessions.submitFreeResponseAnswer.useMutation({
      onSuccess(ans) {
        toast({
          title: "Success!",
          description: "Submitted your answer.",
        });
        form.reset({
          answer: ans.answer,
        });
      },
      onError() {
        toast({
          title: "Error",
          description: "Failed to submit answer.",
          className: "border-destructive",
        });
      },
    });
  useEffect(() => {
    form.reset({
      answer: data?.answer?.answer ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, form]);
  function onSubmit(formData: z.infer<typeof FormSchema>) {
    if (isSuccess && data) {
      submitFreeResponseAnswerMutation.mutate({
        sessionId: sessionId,
        questionId: data.id,
        answer: formData.answer,
      });
    }
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
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
          <Card className="max-w-prose border-0 pt-2 shadow-none">
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
                        <FormControl className="relative">
                          <div>
                            <Input
                              className={cn(
                                "focus:text-primary",
                                !form.formState.isDirty &&
                                  "text-muted-foreground",
                              )}
                              placeholder="Answer here..."
                              {...field}
                            />
                            {!form.formState.isDirty ? (
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <span className="mr-2 text-sm text-muted-foreground">
                                  Saved
                                </span>
                                <Check
                                  className="h-5 w-5 text-green-500"
                                  aria-hidden="true"
                                />
                              </div>
                            ) : (
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <span className="text-sm text-muted-foreground">
                                  Unsaved
                                </span>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription className="pt-2">
                          You may change your answer as many times as you want.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    disabled={
                      submitFreeResponseAnswerMutation.isLoading ||
                      !form.formState.isDirty
                    }
                    type="submit"
                  >
                    {submitFreeResponseAnswerMutation.isLoading
                      ? "Submitting..."
                      : "Submit Answer"}
                  </Button>
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
