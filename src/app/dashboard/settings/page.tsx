import { Separator } from "@/components/ui/separator";
import { AccountForm } from "@/components/AccountForm";
import { api } from "@/trpc/server";

export const metadata = {
  title: "Settings",
};

export default async function Settings() {
  const user = await api.settings.getExistingFormData.query();
  const defaultValues = {
    name: user?.name ?? "",
    computingId: user?.computingId ?? "",
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 rounded-lg border border-border bg-background px-8 py-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Account</h3>
            <p className="text-sm text-muted-foreground">
              Change your account settings
            </p>
          </div>
          <Separator />
          <AccountForm defaultValues={defaultValues} />
        </div>
      </div>
    </div>
  );
}
