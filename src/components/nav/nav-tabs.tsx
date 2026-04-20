"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { use, useEffect, useState, useTransition } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import {
  NAV_BY_PATCH,
  NAV_BY_PATCH_TYPE,
  REFRESH_NAV_ITEMS,
} from "./constants";
import { MONTHS, YEAR } from "@/utils/get-month-days";
import { cn } from "@/lib/utils";
import SelectOptions from "../select/select-options";
import { useHashParam } from "@/hooks/use-hash";
import { revalidateNav } from "@/app/actions/revalidate-tag/revalidate-teg";
import { RefreshCcw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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

  const refreshTeg =
    REFRESH_NAV_ITEMS[
      pathname.split("/")[1] as keyof typeof REFRESH_NAV_ITEMS
    ] ?? "";

  const selectDate = config?.selectDate;
  const navItems = (config?.tabs ?? []) as string[];
  const refresh = config?.refresh ?? false;

  const defaultTab = localStorage.getItem(STORAGE_KEY) || navItems[0];

  useEffect(() => {
    if (!navItems.includes(defaultTab)) return;
    setHash(defaultTab);
  }, [defaultTab, navItems, setHash]);

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
  const resetData = () => {
    if (!refresh) return;
    revalidateNav(refreshTeg);
  };

  const tabsWidth = `w-1/${navItems.length}`;
  const itemsWidth = navItems.length < 6 ? "w-16" : "w-8";

  const flexType = navItems.length < 4 ? "flex-row" : "flex-col";

  const selectClassName =
    "md:w-24 w-10 h-7! md:border px-1 rounded-md text-bl md:text-md text-xs";

  return (
    <div
      className={cn(
        "flex md:flex-row md:justify-between justify-center my-1 md:px-4 sticky top-0 md:gap-2 gap-1",
        flexType,
      )}
    >
      {navItems.length > 0 && (
        <Tabs
          value={defaultTab}
          onValueChange={handleTabChange}
          className={cn(
            "sticky top-0 bg-background z-100",
            !config && "hidden",
          )}
        >
          <TabsList className="flex md:gap-4 h-8 order-1 md:order-0">
            {navItems.map((item, index) => (
              <TabsTrigger
                key={`${item}-${index}`}
                value={item}
                className={cn("hover:text-bl cursor-pointer", tabsWidth)}
                disabled={isPending}
              >
                <span
                  className={cn(
                    "truncate block md:min-w-20 text-xs md:text-md text-bl",
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
      {refresh && (
        <button
          type="button"
          onClick={resetData}
          className="cursor-pointer md:min-w-10 px-4"
        >
          <RefreshCcw className="w-4 h-4 text-bl" />
        </button>
      )}
      {selectDate && (
        <div className="flex md:justify-end justify-center gap-2">
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
