import { getMonthDays, MONTHS } from "@/utils/get-month-days";
import { useSearchParams } from "next/navigation";

export function useMonthDays() {
  const searchParams = useSearchParams();

  const now = new Date();

  const month =
    searchParams.get("month") ?? MONTHS[now.getMonth() + 1];

  const year =
    searchParams.get("year") ?? now.getFullYear().toString();

  const { monthDays } = getMonthDays({ month, year });

  return {
    month,
    year,
    monthDays,
    daysCount: monthDays.length,
  };
}