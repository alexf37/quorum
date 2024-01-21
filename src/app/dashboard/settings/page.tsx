import { Separator } from "@/components/ui/separator";
import { AccountForm } from "./AccountForm";

export const metadata = {
  title: "Settings",
};

export default function Settings() {
  return (
    <div className="h-full flex-1 bg-slate-50">
      <div className="flex items-center gap-2 bg-white px-8 pb-5 pt-6 text-primary">
        <div className="h-9 w-0"></div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>
      <Separator />
      <div className="px-8 py-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white px-8 py-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Account</h3>
                <p className="text-sm text-muted-foreground">
                  Change your account settings
                </p>
              </div>
              <Separator />
              <AccountForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
