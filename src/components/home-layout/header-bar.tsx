"use client";

import { NAV_BY_PATCH } from "@/constants/header-bar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { MONTHS, YEAR } from "@/utils/get-month-days";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useEffectEvent, useState, useTransition } from "react";
import NavTabs from "../nav-tabs/nav-tabs";
import SelectOptions from "../select/select-options";

export default function HeaderBar() {
  const pathname = usePathname();
  const mainRoute = pathname.split("/")[1] || "";
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const STORAGE_KEY = `nav-tab-${pathname}`;

  const config = NAV_BY_PATCH[mainRoute as keyof typeof NAV_BY_PATCH];

  const selectDate = config?.selectDate;

  const navItems: readonly string[] = config?.tabs ?? [];

  const activeTab = searchParams.get("tab") || navItems[0] || "";

  const urlMonth = searchParams.get("month");
  const urlYear = searchParams.get("year");

  const [month, setMonth] = useState(
    () => urlMonth || MONTHS[new Date().getMonth()],
  );
  const [year, setYear] = useState(
    () => urlYear || new Date().getFullYear().toString(),
  );

  useEffect(() => {
    if (!selectDate) return;
    setMonth(urlMonth || MONTHS[new Date().getMonth()]);
    setYear(urlYear || new Date().getFullYear().toString());
  }, [pathname]);

  const onSyncParams = useEffectEvent(
    (items: readonly string[], m: string, y: string, withDate: boolean) => {
      const params = new URLSearchParams(searchParams.toString());

      const hasItems = items.length > 0;
      let resolvedTab: string | undefined;

      if (hasItems) {
        const saved = localStorage.getItem(STORAGE_KEY);
        resolvedTab = saved && items.includes(saved) ? saved : items[0];
      }

      const currentTab = params.get("tab");
      const currentMonth = params.get("month");
      const currentYear = params.get("year");

      const tabSynced = !hasItems || currentTab === resolvedTab;
      const dateSynced = !withDate || (currentMonth === m && currentYear === y);

      if (tabSynced && dateSynced) return;

      if (hasItems && resolvedTab) {
        params.set("tab", resolvedTab);
      }

      if (withDate) {
        params.set("month", m);
        params.set("year", y);
      }

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
  );

  useEffect(() => {
    onSyncParams(navItems, month, year, !!selectDate);
  }, [STORAGE_KEY, navItems, month, year, selectDate, pathname]);

  const handleTabChange = (value: string) => {
    localStorage.setItem(STORAGE_KEY, value);

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);

    // router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
  };

  const selectClassName =
    "md:w-24 w-10 h-6! md:border-border/30 px-1 rounded-md md:text-md text-xs bg-border/30";

  return (
    <div
      className={cn(
        "bg-background sticky top-0 z-10 flex items-center justify-center gap-1 py-2 md:flex-row md:justify-between md:gap-2 md:px-4",
        navItems.length < 4 ? "flex-row" : "flex-col",
      )}
    >
      <NavTabs
        navItems={navItems}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        disabled={isPending}
      />

      {selectDate && (
        <div className="flex justify-center gap-2 md:justify-end">
          <SelectOptions
            options={MONTHS.map((month, index) => ({
              value: month,
              label: isMobile ? String(index + 1) : month,
            }))}
            value={month}
            onChange={setMonth}
            className={selectClassName}
          />
          <SelectOptions
            options={YEAR.map((year) => ({ value: year, label: year }))}
            value={year}
            onChange={setYear}
            className={selectClassName}
          />
        </div>
      )}
    </div>
  );
}
