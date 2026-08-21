"use client";

import SelectMonthYear from "@/components/home-layout/header-bar/select-month-year";
import SelectTabs from "@/components/home-layout/header-bar/select-tabs";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

export default function HeaderBar() {
  const searchParams = useSearchParams();

  const urlMonth = searchParams.get("month");
  const urlYear = searchParams.get("year");
  const urlTab = searchParams.get("tab");

  return (
    <div
      className={cn(
        "bg-background sticky top-0 z-10 flex items-center justify-center gap-1 py-2 md:flex-row md:justify-between md:gap-2 md:px-4",
      )}
    >
      {urlTab && <SelectTabs urlTab={urlTab} />}

      {urlMonth && urlYear && (
        <SelectMonthYear urlMonth={urlMonth} urlYear={urlYear} />
      )}
    </div>
  );
}
