"use client";

import { NAV_BY_PATCH } from "@/constants/endpoint-tag";
import { useHashParam } from "@/hooks/use-hash";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { MONTHS, YEAR } from "@/utils/get-month-days";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import NavTabs from "../nav-tabs/nav-tabs";
import SelectOptions from "../select/select-options";

export default function HeaderBar() {
  const [tab, setHash] = useHashParam("tab");

  const pathname = usePathname();
  const mainRoute = pathname.split("/")[1] || "";

  const searchParams = useSearchParams();

  const isMobile = useIsMobile();

  const defaultMonth =
    searchParams.get("month") || MONTHS[new Date().getMonth()];
  const defaultYear =
    searchParams.get("year") || new Date().getFullYear().toString();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const STORAGE_KEY = `nav-tab-${pathname}`;

  const [month, setMonth] = useState(defaultMonth);
  const [year, setYear] = useState(defaultYear);

  const config = NAV_BY_PATCH[mainRoute as keyof typeof NAV_BY_PATCH];

  const selectDate = config?.selectDate;
  const navItems: readonly string[] = config?.tabs ?? [];
  const activeTab = tab || navItems[0] || "";

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved && navItems.includes(saved)) {
      setHash(saved);
    }
  }, [STORAGE_KEY, navItems, setHash]);

  useEffect(() => {
    if (!selectDate) return;

    const monthFromUrl = searchParams.get("month");
    const yearFromUrl = searchParams.get("year");

    if (monthFromUrl) setMonth(monthFromUrl);
    if (yearFromUrl) setYear(yearFromUrl);
  }, [selectDate, searchParams]);

  useEffect(() => {
    if (!selectDate) return;

    const params = new URLSearchParams(searchParams.toString());

    const currentMonth = params.get("month");
    const currentYear = params.get("year");

    if (currentMonth === month && currentYear === year) return;

    params.set("month", month);
    params.set("year", year);

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [month, year, selectDate, pathname, router, searchParams]);

  const handleTabChange = (value: string) => {
    localStorage.setItem(STORAGE_KEY, value);
    setHash(value);
  };

  const flexType = navItems.length < 4 ? "flex-row" : "flex-col";

  const selectClassName =
    "md:w-24 w-10 h-6! md:border-border/30 px-1 rounded-md text-bl md:text-md text-xs bg-border/30";

  return (
    <div
      className={cn(
        "bg-background sticky top-0 z-10 flex items-center justify-center gap-1 py-2 md:flex-row md:justify-between md:gap-2 md:px-4",
        flexType,
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
