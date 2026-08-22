"use client";
import { NAV_BY_PATCH } from "@/components/home-layout/header-bar/constants";
import { cn } from "@/lib/utils";
import { MONTHS } from "@/utils/get-month-days";
import { ChartColumnBig } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChartButton({
  size = 18,
  url,
  className,
  disabled = false,
}: {
  size?: number;
  url?: string;
  className?: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const tabs = NAV_BY_PATCH[url as keyof typeof NAV_BY_PATCH]?.tabs[0];

  const date = new Date();
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear().toString();

  return (
    <button
      onClick={() =>
        url && router.push(`${url}?tab=${tabs}&month=${month}&year=${year}`)
      }
      className={cn(
        className,
        "cursor-pointer hover:text-black",
        disabled && "opacity-50",
      )}
      type="button"
      disabled={!url || disabled}
    >
      <ChartColumnBig size={size} className="text-bl" strokeWidth={1.5} />
    </button>
  );
}
