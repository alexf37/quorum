"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type PropsWithChildren } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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

type NewSessionModalProps = PropsWithChildren<{
  classId: string;
}>;

const FormSchema = z.object({
  name: z.string().min(1, {
    message: "Session name must be at least 1 character.",
  }),
});

export function NewSessionModal({ children, classId }: NewSessionModalProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const createClassSessionMutation = api.sessions.createSession.useMutation({
    onSuccess() {
      toast({
        title: "Success!",
        description: "Created a new session.",
      });
      router.refresh();
      setOpen(false);
      form.reset();
    },
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    createClassSessionMutation.mutate({
      title: data.name,
      classId,
    });
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl leading-none">
            New Session
          </DialogTitle>
          <DialogDescription>
            Prepare and schedule a new session for your class.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Lecture 2: Set Theory" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be shown to students as well.
                  </FormDescription>
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
