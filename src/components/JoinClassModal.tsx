"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type PropsWithChildren } from "react";
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
  classCode: z.string().min(2, {
    message: "Code must be at least 1 character long",
  }),
});

export function JoinClassModal({ children }: PropsWithChildren) {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      classCode: "",
    },
  });

  const registerMutation = api.classes.registerForClassByCode.useMutation({
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You have successfully joined this class.",
      });
      router.refresh();
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
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join a class</DialogTitle>
          <DialogDescription>
            This will add a class to your dashboard. You can leave a class at
            any time.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-4 items-end gap-4"
          >
            <FormField
              control={form.control}
              name="classCode"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel className="sr-only">Class Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a class code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Join</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
