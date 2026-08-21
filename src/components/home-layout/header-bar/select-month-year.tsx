"use client";

import SelectOptions from "@/components/select/select-options";
import { useIsMobile } from "@/hooks/use-mobile";
import { MONTHS, YEARS } from "@/utils/get-month-days";
import { usePathname, useSearchParams } from "next/navigation";

export default function SelectMonthYear({
  urlMonth,
  urlYear,
}: {
  urlMonth: string;
  urlYear: string;
}) {
  const isMobile = useIsMobile();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectClassName =
    "md:w-24 w-10 h-6! md:border-border/30 px-1 rounded-md md:text-md text-xs bg-border/30";

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
    <div className="flex justify-center gap-2 md:justify-end">
      <SelectOptions
        options={MONTHS.map((month, index) => ({
          value: month,
          label: isMobile ? String(index + 1) : month,
        }))}
        value={urlMonth}
        onChange={handleMonthChange}
        className={selectClassName}
      />

      <SelectOptions
        options={YEARS.map((year) => ({
          value: year,
          label: year,
        }))}
        value={urlYear}
        onChange={handleYearChange}
        className={selectClassName}
      />
    </div>
  );
}
