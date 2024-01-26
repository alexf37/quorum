import { ModeToggle } from "@/components/ModeToggle";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/server";
import { DashboardButton } from "./DashboardButton";

export default async function ManageClass({
  params,
}: {
  params: { class: string };
}) {
  const clazz = await api.classes.getClassById.query({
    classId: params.class,
  });
  return (
    <div>
      <div className="mx-auto flex h-20 max-w-screen-xl items-center gap-2 bg-background px-8 pb-5 pt-6 text-primary max-sm:hidden">
        <div className="flex items-center gap-4">
          <DashboardButton />
          <h1 className="text-3xl font-bold tracking-tight">{clazz.title}</h1>
        </div>
        <div className="ml-auto">
          <ModeToggle />
        </div>
      </div>
      <Separator />
      <div className="mx-auto max-w-screen-xl px-8 py-6">
        <h1 className="pb-2 text-2xl font-semibold text-primary">Hi :3</h1>
      </div>
    </div>
  );
}
