"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { NAV_BY_PATCH } from "./constants";
import SelectByMonthYear from "./select-month-year";
import { MONTHS } from "@/utils/getMonthDays";
import { cn } from "@/lib/utils";

export default function NavTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [month, setMonth] = useState(() => MONTHS[new Date().getMonth()]);
  const [year, setYear] = useState(() => new Date().getFullYear().toString());

  const config =
    NAV_BY_PATCH[pathname.split("/")[1] as keyof typeof NAV_BY_PATCH];

  const filterType = config?.filterMonth;
  const navItems = config?.navItems ?? [];

  const tabFromUrl = searchParams.get("tab");
  const isValidTab = navItems.some((item) => item.value === tabFromUrl);
  const defaultTab = navItems[0]?.value;
  const currentTab = isValidTab ? tabFromUrl! : defaultTab;

  useEffect(() => {
    if (!defaultTab) return;

    if (!tabFromUrl || !isValidTab) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", defaultTab);

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      });
    }
  }, [tabFromUrl, isValidTab, defaultTab, pathname, router, searchParams]);

  useEffect(() => {
    if (!filterType) return;

    const monthFromUrl = searchParams.get("month");
    const yearFromUrl = searchParams.get("year");

    if (monthFromUrl) setMonth(monthFromUrl);
    if (yearFromUrl) setYear(yearFromUrl);
  }, [filterType, searchParams]);

  useEffect(() => {
    if (!filterType) return;

    const params = new URLSearchParams(searchParams.toString());

    const currentMonth = params.get("month");
    const currentYear = params.get("year");

    if (currentMonth === month && currentYear === year) return;

    params.set("month", month);
    params.set("year", year);

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    });
  }, [month, year, filterType, pathname, router, searchParams]);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    });
  };

  const tabsWidth = `w-1/${navItems.length}`;

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      <div className="flex justify-between my-2 px-4">
        {navItems.length > 0 && (
          <TabsList className="flex md:gap-4 h-8">
            {navItems.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className={cn("hover:text-bl cursor-pointer", tabsWidth)}
                disabled={isPending}
              >
                <span className="truncate block min-w-20 text-xs md:text-md text-bl">
                  {item.label}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        )}

        {filterType && (
          <SelectByMonthYear
            month={month}
            year={year}
            setMonth={setMonth}
            setYear={setYear}
            isLoading={isPending}
            classNameMonthYear={navItems.length > 0 ? "md:w-22 w-10" : "w-24"}
          />
        )}
      </div>
    </Tabs>
  );
}
