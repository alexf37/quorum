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
