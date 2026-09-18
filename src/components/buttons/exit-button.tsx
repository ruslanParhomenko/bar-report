"use client";

import { cn } from "@/lib/utils";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ExitButton({
  className,
  disabled = false,
  url,
  size = 18,
}: {
  className?: string;
  disabled?: boolean;
  url?: string;
  size?: number;
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
      <LogOutIcon size={size} strokeWidth={1.5} className="text-rd" />
    </button>
  );
}
