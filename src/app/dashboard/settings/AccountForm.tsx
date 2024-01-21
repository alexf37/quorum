"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui//form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";

const accountFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name must not be empty.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  computingId: z
    .string()
    .min(6, {
      message: "Computing ID must be at least 6 characters.",
    })
    .max(7, {
      message: "Computing ID must be at most 7 characters.",
    }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function AccountForm({
  defaultValues,
}: {
  defaultValues?: Partial<AccountFormValues>;
}) {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const settingsMutation = api.settings.updateFormData.useMutation({
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your account details have been updated.",
      });
    },
  });

  function onSubmit(data: AccountFormValues) {
    settingsMutation.mutate(data);
    // toast({
    //   title: "Verification email sent.",
    //   description:
    //     "Check your inbox (and spam folder) for a verification email.",
    // });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-md space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name, shown only to hosts.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="computingId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Computing ID</FormLabel>
              <FormControl>
                <Input placeholder="xrk4np" {...field} />
              </FormControl>
              <FormDescription>
                We'll send an email to your university email to verify this.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save Details</Button>
      </form>
    </Form>
  );
}
