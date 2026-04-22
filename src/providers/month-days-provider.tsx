"use client";

import { getMonthDays, MONTHS } from "@/utils/get-month-days";
import { createContext, ReactNode, useContext, useMemo } from "react";
import { useSearchParams } from "next/navigation";

type MonthDaysContextType = {
  month: string;
  year: string;
  monthDays: { day: number; weekday: string }[];
  daysCount: number;
};

const MonthDaysContext = createContext<MonthDaysContextType | null>(null);

export default function MonthDaysProvider({
  children,
}: {
  children: ReactNode;
}) {
  const searchParams = useSearchParams();

  const month = searchParams.get("month") ?? MONTHS[new Date().getMonth() + 1];
  const year = searchParams.get("year") ?? new Date().getFullYear().toString();

  const monthDays = getMonthDays({ month, year }).monthDays;

  const daysCount = monthDays.length;

  return (
    <MonthDaysContext.Provider value={{ month, year, monthDays, daysCount }}>
      {children}
    </MonthDaysContext.Provider>
  );
}

export function useMonthDays() {
  const context = useContext(MonthDaysContext);
  if (!context) {
    throw new Error("useMonthDays must be used within MonthDaysProvider");
  }
  return context;
}
