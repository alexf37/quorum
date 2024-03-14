import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function SessionLoading() {
  return (
    <div className="grid h-full place-content-center">
      <div className="flex flex-col items-center gap-2">
        <LoadingSpinner className="mb-2 size-12" />
        <h1 className="text-center text-xl font-semibold text-primary drop-shadow">
          Just a moment...
        </h1>
        {/* <p className="max-w-md text-center text-lg text-muted-foreground">
          Loading this page
        </p> */}
      </div>
    </div>
  );
}
