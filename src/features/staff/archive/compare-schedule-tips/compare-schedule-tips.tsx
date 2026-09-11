"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getScheduleByYearAndMonth } from "@/features/schedule/schedule-edit/actions/get-schedule";
import { GetScheduleData } from "@/features/schedule/schedule-edit/model/type";
import { GetTipsAddData } from "@/features/tips-add/model/type";
import { cn } from "@/lib/utils";
import { startTransition, useEffect, useMemo, useState } from "react";

const EMPTY_SHIFT_CODES = ["v", "s", "x", "u", "/"];

export default function CompareScheduleTipsPage({
  dataTips,
  month,
  year,
}: {
  dataTips: GetTipsAddData[] | null;
  month: string;
  year: string;
}) {
  const [schedule, setSchedule] = useState<GetScheduleData | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getScheduleByYearAndMonth(year, month);
      const dataBar = data?.filter((d) => d.id === "bar") ?? null;

      startTransition(() => {
        setSchedule(dataBar?.[0] ?? null);
      });
    }

    load();
  }, [year, month]);

  const days = useMemo(() => {
    if (!dataTips) return [];
    return [...dataTips].sort((a, b) => Number(a.id) - Number(b.id));
  }, [dataTips]);

  function normalizeScheduleValue(value: string | undefined | null): string {
    if (!value) return "";
    return EMPTY_SHIFT_CODES.includes(value) ? "" : value;
  }

  function getScheduleStart(value: string): string {
    if (!value) return "";
    return value.includes(".") ? value.split(".")[0] : value;
  }

  function getTipShift(dayId: string, employeeId: string): string | null {
    if (!dataTips) return null;
    const dayTip = dataTips.find((d) => d.id === dayId);
    if (!dayTip) return null;

    const entry = dayTip.tipsAdd.find((t) => t.idEmployee === employeeId);
    if (!entry || !entry.shift) return null;

    return entry.shift;
  }

  if (!dataTips || dataTips.length === 0) {
    return (
      <div className="text-muted-foreground p-4 text-sm">
        Нет данных по чаевым
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="text-muted-foreground p-4 text-sm">
        Загрузка графика...
      </div>
    );
  }

  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow>
          <TableHead className="bg-background sticky left-0 z-10 w-30 truncate pr-1 pl-2">
            Имя
          </TableHead>
          {days.map((day) => (
            <TableHead
              key={day.id}
              className="w-8.5 border-x p-0 text-center text-xs"
            >
              {day.id}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {schedule.rowShifts.map((row) => (
          <TableRow key={row.id} className="[&>td]:text-xs">
            <TableCell className="bg-background text-muted-foreground sticky left-0 truncate pr-1 pl-2 md:bg-transparent">
              {row.employee}
            </TableCell>
            {days.map((day) => {
              const dayIndex = Number(day.id) - 1;
              const rawScheduleValue = row.shifts[dayIndex] ?? "";
              const scheduleValue = normalizeScheduleValue(rawScheduleValue);
              const scheduleStart = getScheduleStart(scheduleValue);
              const tipShift = getTipShift(day.id, row.employeeId);
              const tipStart = tipShift ? tipShift.split("-")[0] : null;

              const hasSchedule = !!scheduleValue;
              const hasTip = tipShift !== null;

              let statusClass = "";
              let content: React.ReactNode = rawScheduleValue || "-";

              if (hasSchedule && hasTip) {
                if (tipStart === scheduleStart) {
                  statusClass = "bg-green-500/20";
                } else {
                  statusClass = "bg-red-500/20";
                  content = (
                    <>
                      {rawScheduleValue}
                      <span className="text-rd"> ({tipShift})</span>
                    </>
                  );
                }
              } else if (hasSchedule && !hasTip) {
                statusClass = "bg-amber-500/20";
                content = (
                  <>
                    {rawScheduleValue}
                    <span className="text-amber-600"> (?)</span>
                  </>
                );
              } else if (!hasSchedule && hasTip) {
                statusClass = "bg-blue-500/20";
                content = <span className="text-blue-600">({tipShift})</span>;
              }
              return (
                <TableCell
                  key={day.id}
                  className={cn(
                    "border-x p-0 text-center text-xs",
                    statusClass,
                  )}
                >
                  {content}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
