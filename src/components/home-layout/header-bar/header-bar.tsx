"use client";

import ActionButtons from "@/components/home-layout/footer-bar/action-buttons";
import SelectMonthYear from "@/components/home-layout/header-bar/select-month-year";
import SelectTabs from "@/components/home-layout/header-bar/select-tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

export default function HeaderBar({ isAdmin }: { isAdmin: boolean }) {
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();

  const urlMonth = searchParams.get("month");
  const urlYear = searchParams.get("year");
  const urlTab = searchParams.get("tab");

  const showTabs = urlTab && !isMobile;
  const showMonthYear = urlMonth && urlYear;

  return (
    <div
      className={cn(
        "bg-background sticky top-0 z-9 flex flex-row items-center justify-between gap-1 py-1 md:gap-2 md:px-4",
      )}
    >
      {isMobile && <ActionButtons isAdmin={isAdmin} tab={urlTab!} size={14} />}
      {showTabs && <SelectTabs urlTab={urlTab} />}
      {showMonthYear && (
        <SelectMonthYear urlMonth={urlMonth} urlYear={urlYear} />
      )}
    </div>
  );
}
