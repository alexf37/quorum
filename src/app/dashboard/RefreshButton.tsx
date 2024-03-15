"use client";
import { useRouter } from "next/navigation";

export function RefreshButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const router = useRouter();
  return (
    <button onClick={() => router.refresh()} {...props}>
      {props.children ?? "Refresh"}
    </button>
  );
}
