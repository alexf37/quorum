import { Separator } from "@/components/ui/separator";

export default function Classes() {
  return (
    <div className="h-full flex-1 bg-slate-50">
      <div className="flex items-center gap-2 bg-white px-8 pb-5 pt-6 text-primary">
        <div className="h-9 w-0"></div>
        <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
      </div>
      <Separator />
      <div className="px-8 py-6"></div>
    </div>
  );
}
