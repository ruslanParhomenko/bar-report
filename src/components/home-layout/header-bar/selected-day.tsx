"use client";

import SelectDay from "@/components/select/select-day";
import { getMonthDays } from "@/utils/get-month-days";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SelectedDay({ urlDay }: { urlDay: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const month = searchParams.get("month") || "";
  const year = searchParams.get("year") || "";

  const { monthDays } = getMonthDays({ month, year });

  const selectClassName =
    "md:w-24 w-14  h-6! border-0 px-1 rounded-md md:text-md text-xs bg-border/50 text-bl";

  const handleDayChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("day", value);

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="order-1 flex items-center justify-center gap-3 md:order-2">
      <SelectDay
        value={urlDay}
        onChange={handleDayChange}
        monthDays={monthDays}
        className={selectClassName}
      />
    </div>
  );
}
