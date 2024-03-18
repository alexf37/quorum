"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";

const organizations = [
  { label: "University of Virginia", value: "uva" },
  { label: "Virginia Tech", value: "vt" },
  { label: "George Mason University", value: "gmu" },
  { label: "Coastal Carolina University", value: "ccu" },
] as const;

const FormSchema = z.object({
  organization: z.string({
    required_error: "Please select a organization.",
  }),
});

export function OrganizationForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "Error",
      description: "Could not set your organization.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="organization"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Organization</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[300px] justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? organizations.find(
                            (organization) =>
                              organization.value === field.value,
                          )?.label
                        : "Select organization"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search organization..." />
                    <CommandEmpty>No organization found.</CommandEmpty>
                    <CommandGroup>
                      {organizations.map((organization) => (
                        <CommandItem
                          value={organization.label}
                          key={organization.value}
                          onSelect={() => {
                            form.setValue("organization", organization.value);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              organization.value === field.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {organization.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the organization that will be used to verify your ID.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
