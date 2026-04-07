"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { NAV_BY_PATCH } from "./constants";
import { MONTHS, YEAR } from "@/utils/get-month-days";
import { cn } from "@/lib/utils";
import SelectOptions from "../select/select-options";
import { useHashParam } from "@/hooks/use-hash";

export default function NavTabs() {
  const [_value, setHash] = useHashParam("tab");

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const defaultMonth =
    searchParams.get("month") || MONTHS[new Date().getMonth()];
  const defaultYear =
    searchParams.get("year") || new Date().getFullYear().toString();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const STORAGE_KEY = `nav-tab-${pathname}`;

  const [month, setMonth] = useState(defaultMonth);
  const [year, setYear] = useState(defaultYear);

  const config =
    NAV_BY_PATCH[pathname.split("/")[1] as keyof typeof NAV_BY_PATCH];

  const selectDate = config?.selectDate;
  const navItems = (config?.tabs ?? []) as string[];

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

  const tabsWidth = `w-1/${navItems.length}`;
  const itemsWidth = navItems.length < 6 ? "w-12" : "w-10";

  const selectClassName =
    "md:w-24 w-16 h-7! md:border p-1 rounded-full text-bl md:text-md text-xs";

  return (
    <div className="flex flex-col md:flex-row md:justify-between justify-center mt-2 mb-1 md:px-4 sticky top-2">
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
      {selectDate && (
        <div className="flex md:justify-end justify-center gap-2">
          <SelectOptions
            options={MONTHS.map((month) => ({ value: month, label: month }))}
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
