"use client";

import { useHashParam } from "@/hooks/use-hash";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { MONTHS, YEAR } from "@/utils/get-month-days";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import SelectOptions from "../select/select-options";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { NAV_BY_PATCH, NAV_BY_PATCH_TYPE } from "./constants";

export default function NavTabs() {
  const [_value, setHash] = useHashParam("tab");

  const pathname = usePathname();
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

  const config = NAV_BY_PATCH[
    pathname.split("/")[1] as keyof typeof NAV_BY_PATCH
  ] as NAV_BY_PATCH_TYPE[string];

  const selectDate = config?.selectDate;
  const navItems = (config?.tabs ?? []) as string[];

  const [tab, setTab] = useState(navItems[0]);
  const defaultTab = localStorage.getItem(STORAGE_KEY) || navItems[0];

  // useEffect(() => {
  //   if (!navItems.includes(defaultTab)) return;
  //   setHash(defaultTab);
  // }, [defaultTab, navItems, setHash]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved && navItems.includes(saved)) {
      setTab(saved);
    }
  }, [STORAGE_KEY, navItems]);

  useEffect(() => {
    setHash(tab);
  }, [tab, setHash]);

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

    startTransition(() => {
      setTab(value);
    });
  };

  const tabsWidth = `w-1/${navItems.length}`;
  const itemsWidth = navItems.length < 6 ? "w-16" : "w-8";

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
      {navItems.length > 0 && (
        <Tabs
          value={tab}
          onValueChange={handleTabChange}
          className={cn(
            "bg-background sticky top-0 z-100",
            !config && "hidden",
          )}
        >
          <TabsList className="order-1 flex h-7 md:order-0 md:gap-4">
            {navItems.map((item, index) => (
              <TabsTrigger
                key={`${item}-${index}`}
                value={item}
                className={cn("hover:text-bl cursor-pointer", tabsWidth)}
                disabled={isPending}
              >
                <span
                  className={cn(
                    "md:text-md text-bl block truncate text-xs md:min-w-20",
                    itemsWidth,
                  )}
                >
                  {item}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}
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
