"use client";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { DoorClosed, LogOutIcon } from "lucide-react";

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
        url ? router.push(url) : router.back();
      }}
      disabled={disabled}
      className={cn("cursor-pointer", className, disabled && "opacity-50")}
    >
      <LogOutIcon className="h-5 w-5 hover:text-bl" strokeWidth={1.5} />
    </button>
  );
}
