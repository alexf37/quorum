import { cn } from "@/lib/utils";

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

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
