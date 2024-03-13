"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, type PropsWithChildren } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  courseCode: z
    .string()
    .min(4, {
      message: "Course code must be at least 4 characters long",
    })
    .max(12, {
      message: "Course code must be at most 12 characters long",
    }),
  joinCode: z
    .string()
    .min(4, {
      message: "Join code must be at least 4 characters long",
    })
    .max(12, {
      message: "Join code must be at most 12 characters long",
    }),
  title: z
    .string()
    .min(4, {
      message: "Title must be at least 4 characters long",
    })
    .max(50, {
      message: "Title must be at most 50 characters long",
    }),
});

export function CreateClassModal({ children }: PropsWithChildren) {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      courseCode: "",
      joinCode: "",
      title: "",
    },
  });
  const [open, setOpen] = useState(false);

  const registerMutation = api.classes.createClass.useMutation({
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You have successfully created a class.",
      });
      router.refresh();
      setOpen(false);
      form.reset();
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        className: "border-destructive",
      });
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    registerMutation.mutate(data);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create a class</DialogTitle>
          <DialogDescription>
            Create a class to start hosting sessions.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="courseCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Code</FormLabel>
                  <FormControl>
                    <Input placeholder="QSTD 1020" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="joinCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Join Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a join code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Introduction to Quorum II" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-2">
              <Button disabled={registerMutation.isLoading} type="submit">
                Create Class
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
