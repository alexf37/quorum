"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
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
  computingId: z.string().min(4, {
    message: "Computing ID must be at least 4 characters long",
  }),
});

export function ComputingIdPopup() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      computingId: "",
    },
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const cidMutation = api.settings.setComputingId.useMutation({
    onSuccess: (res) => {
      toast({
        title: "Success!",
        description: res.message,
      });
      router.replace("/dashboard");
      router.refresh();
      setOpen(false);
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
    cidMutation.mutate(data);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set your computing ID</DialogTitle>
          <DialogDescription>
            This will be used to identify you and will be verified by email.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-4 items-end gap-4"
          >
            <FormField
              control={form.control}
              name="computingId"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel className="sr-only">Computing ID</FormLabel>
                  <FormControl>
                    <Input placeholder="mst3k" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={cidMutation.isLoading} type="submit">
              Join
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
