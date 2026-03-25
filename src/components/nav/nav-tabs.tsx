"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { NAV_BY_PATCH, REVALIDATE_TAGS_BY_PATCH } from "./constants";
import { MONTHS, YEAR } from "@/utils/get-month-days";
import { cn } from "@/lib/utils";
import { revalidateNav } from "@/app/actions/revalidate-tag/revalidate-teg";
import { RefreshCcw } from "lucide-react";
import SelectOptions from "../select/select-options";

export default function NavTabs() {
  const pathname = usePathname();
  const mainRoute = pathname.split("/")[1];
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const STORAGE_KEY = `nav-tab-${pathname}`;

  const [month, setMonth] = useState(() => MONTHS[new Date().getMonth()]);
  const [year, setYear] = useState(() => new Date().getFullYear().toString());

  const config =
    NAV_BY_PATCH[pathname.split("/")[1] as keyof typeof NAV_BY_PATCH];

  const filterMonth = config?.filterMonth;
  const filterYear = config?.filterYear;
  const refresh = config?.refresh;
  const navItems = config?.navItems ?? [];

  const tabFromUrl = searchParams.get("tab");

  const isValidTab = navItems.some((item) => item.value === tabFromUrl);

  const defaultTab = navItems[0]?.value;

  const currentTab = tabFromUrl && isValidTab ? tabFromUrl : defaultTab;

  useEffect(() => {
    if (!defaultTab) return;

    if (tabFromUrl && isValidTab) {
      localStorage.setItem(STORAGE_KEY, tabFromUrl);
      return;
    }

    const storedTab = localStorage.getItem(STORAGE_KEY);

    const validStored =
      storedTab && navItems.some((i) => i.value === storedTab)
        ? storedTab
        : null;

    const tabToUse = validStored ?? defaultTab;

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabToUse);

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    });
  }, [
    tabFromUrl,
    isValidTab,
    defaultTab,
    pathname,
    router,
    searchParams,
    navItems,
  ]);

  useEffect(() => {
    if (!filterMonth && !filterYear) return;

    const monthFromUrl = searchParams.get("month");
    const yearFromUrl = searchParams.get("year");

    if (monthFromUrl) setMonth(monthFromUrl);
    if (yearFromUrl) setYear(yearFromUrl);
  }, [filterMonth, searchParams]);

  useEffect(() => {
    if (!filterMonth && !filterYear) return;

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
  }, [month, year, filterMonth, pathname, router]);

  const handleTabChange = (value: string) => {
    localStorage.setItem(STORAGE_KEY, value);

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    });
  };

  // refresh data
  const tag =
    REVALIDATE_TAGS_BY_PATCH[
      mainRoute as keyof typeof REVALIDATE_TAGS_BY_PATCH
    ];

  const resetData = () => {
    if (!tag) return;
    revalidateNav(tag);
    router.refresh();
  };

  const tabsWidth = `w-1/${navItems.length}`;
  const itemsWidth = navItems.length < 6 ? "w-12" : "w-10";

  const selectClassName =
    "md:w-24 w-16 h-7! md:border p-1 rounded-full text-bl md:text-md text-xs";

  return (
    <Tabs
      value={currentTab}
      onValueChange={handleTabChange}
      className={cn("sticky top-0 bg-background z-30", !config && "hidden")}
    >
      <div className="flex flex-col md:flex-row md:justify-between justify-center my-2 md:px-4">
        {navItems.length > 0 && (
          <TabsList className="flex md:gap-4 h-8 order-1 md:order-0">
            {navItems.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className={cn("hover:text-bl cursor-pointer", tabsWidth)}
                disabled={isPending}
              >
                <span
                  className={cn(
                    "truncate block md:min-w-20 text-xs md:text-md text-bl",
                    itemsWidth,
                  )}
                >
                  {item.label}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        )}
        <div className="flex md:justify-end justify-center gap-2">
          {filterMonth && (
            <SelectOptions
              options={MONTHS}
              value={month}
              setValue={setMonth}
              className={selectClassName}
            />
          )}
          {filterYear && (
            <SelectOptions
              options={YEAR}
              value={year}
              setValue={setYear}
              className={selectClassName}
            />
          )}
          {refresh && (
            <button
              onClick={resetData}
              className="cursor-pointer flex items-center justify-center md:w-10 w-8 h-7!"
            >
              <RefreshCcw className="w-4 h-3 text-bl" />
            </button>
          )}
        </div>
      </div>
    </Tabs>
  );
}
