"use client";

import SelectOptions from "@/components/select/select-options";
import { useSidebar } from "@/components/ui/sidebar";
import { MONTHS, YEARS } from "@/utils/get-month-days";
import { usePathname, useSearchParams } from "next/navigation";

export default function SelectMonthYear({
  urlMonth,
  urlYear,
}: {
  urlMonth: string;
  urlYear: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { isMobile } = useSidebar();

  const selectClassName =
    "md:w-24 w-11  md:h-7! h-6!  md:border-border/30 px-1 rounded-md md:text-md text-xs bg-border/30";

  const handleMonthChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("month", value);

    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
  };

  const handleYearChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("year", value);

    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-1 md:gap-4">
      <SelectOptions
        options={MONTHS.map((month) => ({
          value: month,
          label: isMobile ? month.slice(0, 3) : month,
        }))}
        value={urlMonth}
        onChange={handleMonthChange}
        className={selectClassName}
      />

      <SelectOptions
        options={YEARS.map((year) => ({
          value: year,
          label: isMobile ? year.slice(-2) : year,
        }))}
        value={urlYear}
        onChange={handleYearChange}
        className={selectClassName}
      />
    </div>
  );
}
