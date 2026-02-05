"use client";

import { MONTHS } from "@/utils/getMonthDays";
import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

import SelectTabsByPatch from "./select-patch";
import SelectByMonthYear from "./select-month-year";
import SelectEmployeeBy from "@/components/nav/Select-employee";

import { RefreshCcw, RotateCcw } from "lucide-react";
import { NAV_BY_PATCH, REVALIDATE_TAGS_BY_PATCH } from "./constants";
import { revalidateNav } from "@/app/actions/revalidate-tag/revalidate-teg";

export default function NavPatch() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const segments = pathname.split("/").filter(Boolean);
  const mainRoute = segments[0] ?? "";

  const config = NAV_BY_PATCH[mainRoute as keyof typeof NAV_BY_PATCH];
  const filterType = config?.filterType;
  const navItems = config?.navItems ?? [];

  const patch =
    navItems.length === 0
      ? ""
      : navItems.some((item) => item.href === segments[1])
        ? segments[1]
        : navItems[0].href;

  const [month, setMonth] = useState(() => MONTHS[new Date().getMonth()]);
  const [year, setYear] = useState(() => new Date().getFullYear().toString());
  const [role, setRole] = useState("waiters");

  useEffect(() => {
    const params = new URLSearchParams();

    if (filterType === "role" && role) params.set("role", role);
    if (filterType === "month") {
      params.set("month", month);
      params.set("year", year);
    }

    const url =
      navItems.length > 0
        ? `/${mainRoute}/${patch}?${params.toString()}`
        : `/${mainRoute}?${params.toString()}`;

    startTransition(() => {
      router.replace(url);
    });
  }, [
    patch,
    filterType,
    role,
    month,
    year,
    mainRoute,
    navItems.length,
    router,
  ]);

  const setPatch = (nextPatch: string) => {
    startTransition(() => router.replace(`/${mainRoute}/${nextPatch}`));
  };

  const resetPatch = () => {
    startTransition(() => router.replace(`/${mainRoute}`));
  };

  const resetData = () => {
    const tag =
      REVALIDATE_TAGS_BY_PATCH[
        mainRoute as keyof typeof REVALIDATE_TAGS_BY_PATCH
      ];
    if (tag) revalidateNav(tag);
    router.refresh();
  };

  return (
    <div className="md:py-2 mt-1 mb-1 sticky top-0 z-10 flex justify-between items-center bg-background md:px-4 px-1">
      <div className="flex items-center md:gap-4 gap-2 order-2 md:order-1">
        {navItems.length > 0 && (
          <>
            <SelectTabsByPatch
              patch={patch}
              setPatch={setPatch}
              isPending={isPending}
              navItems={navItems}
            />
            {patch && (
              <button
                onClick={resetPatch}
                className="cursor-pointer items-center justify-center w-6 h-8 hidden md:flex"
              >
                <RotateCcw className="w-4 h-4 text-bl" />
              </button>
            )}
          </>
        )}

        {filterType === "month" && (
          <SelectByMonthYear
            month={month}
            year={year}
            setMonth={setMonth}
            setYear={setYear}
            isLoading={isPending}
            classNameMonthYear={navItems.length > 0 ? "md:w-22 w-10" : "w-24"}
          />
        )}

        {filterType === "role" && (
          <SelectEmployeeBy role={role} setRole={setRole} />
        )}
      </div>

      <button
        onClick={resetData}
        className="hover:text-black hover:bg-transparent cursor-pointer flex items-center justify-center md:w-10 w-8 h-8 order-1 md:order-2"
      >
        <RefreshCcw className="w-4 h-4" />
      </button>
    </div>
  );
}
