"use client";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

export default function ViewButton({
  url,
  disabled = true,
  size = 16,
}: {
  url: string;
  disabled?: boolean;
  size?: number;
}) {
  const router = useRouter();

  return (
    <button
      className={cn(
        "flex cursor-pointer flex-col items-center gap-0.5",
        disabled && "cursor-not-allowed opacity-30",
      )}
      type="button"
      onClick={() => router.push(url)}
      disabled={disabled}
    >
      <ExternalLink size={size} className="hover:text-rd text-bl" />
    </button>
  );
}
