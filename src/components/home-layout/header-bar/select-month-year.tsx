"use client";

import SelectOptions from "@/components/select/select-options";
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

  const selectClassName =
    "w-24  md:h-7! h-6!  md:border-border/30 px-1 rounded-md md:text-md text-xs bg-border/30";

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
    <div className="flex items-center justify-center gap-4">
      <SelectOptions
        options={MONTHS.map((month) => ({
          value: month,
          label: month,
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
