"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, type PropsWithChildren } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const FormSchema = z.object({
  prompt: z.string().min(2, {
    message: "Prompt must be at least 2 characters.",
  }),
  isLatex: z.boolean(),
});

type AddQuestionModalProps = PropsWithChildren<{
  sessionId: string;
}>;
export function AddQuestionModal({
  sessionId,
  children,
}: AddQuestionModalProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: "",
      isLatex: false,
    },
  });
  const router = useRouter();
  const utils = api.useUtils();
  const [open, setOpen] = useState(false);
  const addNewQuestionMutation =
    api.sessions.addFreeResponseQuestion.useMutation({
      onSuccess() {
        toast({
          title: "Success!",
          description: "Added a new question.",
        });
        void utils.sessions.getFreeResponseQuestionsBySessionId.invalidate();
        router.refresh();
        setOpen(false);
        form.reset();
      },
    });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    addNewQuestionMutation.mutate({
      prompt: data.prompt,
      isLatex: data.isLatex,
      sessionId,
    });
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl leading-none">
            Add question
          </DialogTitle>
          <DialogDescription>
            Prepare a new question for this class session.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-4"
          >
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    {form.watch("isLatex") ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex min-h-10 flex-col gap-2 rounded-md border border-input px-3 py-2 text-xs text-muted-foreground ">
                          {form.watch("prompt") && (
                            <Latex>{form.watch("prompt")}</Latex>
                          )}

                          <Input
                            className="h-auto !border-0 p-0 text-primary !outline-0 !ring-0 !ring-offset-0"
                            {...field}
                          />
                        </div>
                      </div>
                    ) : (
                      <Input placeholder="What is 2 + 2?" {...field} />
                    )}
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isLatex"
              render={({ field }) => (
                <FormItem className="flex gap-3 space-y-0 pb-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="leading-none">
                    <FormLabel>Use LaTeX</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
