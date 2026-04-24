"use client";

import { cn } from "@/lib/utils";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ExitButton({
  className,
  disabled = false,
  url,
}: {
  className?: string;
  disabled?: boolean;
  url?: string;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        url ? router.replace(url) : router.back();
      }}
      disabled={disabled}
      className={cn("cursor-pointer", className, disabled && "opacity-50")}
    >
      <LogOutIcon className="hover:text-bl h-5 w-5" strokeWidth={1.5} />
    </button>
  );
}
