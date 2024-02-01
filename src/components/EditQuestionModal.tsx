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
});

type EditQuestionModalProps = PropsWithChildren<{
  questionId: string;
  sessionId: string;
  questionPrompt: string;
}>;

export function EditQuestionModal({
  children,
  questionId,
  sessionId,
  questionPrompt,
}: EditQuestionModalProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: questionPrompt ?? "",
    },
  });
  const router = useRouter();
  const utils = api.useUtils();
  const [open, setOpen] = useState(false);
  const editQuestionMutation =
    api.sessions.editFreeResponseQuestion.useMutation({
      onSuccess() {
        toast({
          title: "Success!",
          description: "Edited question.",
        });
        void utils.sessions.getFreeResponseQuestionsBySessionId.invalidate();
        router.refresh();
        setOpen(false);
        form.reset();
      },
    });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    editQuestionMutation.mutate({
      prompt: data.prompt,
      questionId,
      sessionId,
    });
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit question</DialogTitle>
          <DialogDescription>
            Change details about this question.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Input placeholder="What is 2 + 2?" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
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
