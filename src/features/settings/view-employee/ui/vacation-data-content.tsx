"use client";

import { formatDate } from "@/utils/format-date";
import { differenceInCalendarDays } from "date-fns";
import { CalendarDays } from "lucide-react";

export default function VacationDataCard({
  index,
  vacation,
}: {
  index: number;
  vacation: {
    startDate: string;
    endDate: string;
  };
}) {
  const days =
    vacation.startDate &&
    vacation.endDate &&
    vacation.endDate >= vacation.startDate
      ? differenceInCalendarDays(vacation.endDate, vacation.startDate) + 1
      : null;
  return (
    <div className="group border-border/60 bg-muted/20 hover:border-primary/20 hover:bg-muted/50 grid min-w-0 grid-cols-[16%_58%_12%] items-center gap-3 rounded-xl border p-2.5 transition-colors duration-200 hover:text-blue-600 md:grid-cols-[30%_auto_12%]">
      <div className="text-muted-foreground flex items-center gap-4">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <div className="bg-background flex size-6 shrink-0 items-center justify-center rounded-lg shadow-sm md:size-8">
            <CalendarDays className="text-muted-foreground size-4 group-hover:text-blue-600" />
          </div>

          <span className="truncate text-[11px] font-medium md:text-sm">
            Отпуск {index + 1}
          </span>
        </div>
      </div>
      <div className="flex flex-1 justify-start gap-5 font-semibold tracking-tight wrap-break-word md:gap-8">
        <div>
          <p className="text-muted-foreground text-xs">Начало</p>
          <p className="text-xs font-medium wrap-break-word md:text-sm">
            {formatDate(vacation.startDate)}
          </p>
        </div>

        <div className="">
          <p className="text-muted-foreground text-xs">Окончание</p>
          <p className="text-xs font-medium wrap-break-word md:text-sm">
            {formatDate(vacation.endDate)}
          </p>
        </div>
      </div>

      <div className="bg-primary/[0.07] flex min-w-16 shrink-0 flex-wrap items-center justify-center gap-2 rounded-xl px-1 py-2">
        <span className="text-md font-semibold tracking-tight tabular-nums md:text-lg">
          {days ?? "—"}
        </span>

        <span className="text-muted-foreground text-[11px]">
          {days === null
            ? "дней"
            : days === 1
              ? "день"
              : days >= 2 && days <= 4
                ? "дня"
                : "дней"}
        </span>
      </div>
    </div>
  );
}
