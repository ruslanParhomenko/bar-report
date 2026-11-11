"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  SHIFT_COLOR_MAP,
  SHIFTS,
} from "@/features/schedule/schedule-edit/model/constants";
import { GetScheduleData } from "@/features/schedule/schedule-edit/model/type";
import { GetTipsAddData } from "@/features/tips-add/model/type";
import { useMonthDays } from "@/hooks/use-month-days";
import { cn } from "@/lib/utils";
import { MONTHS } from "@/utils/get-month-days";
import { useMemo } from "react";

const TOLERANCE_MIN = 10;

const getTimestamp = (
  year: number,
  monthIndex: number,
  day: number,
  hours = 0,
  minutes = 0,
) => new Date(year, monthIndex, day, hours, minutes).getTime();

const applyTolerance = (min: number): number =>
  Math.abs(min) <= TOLERANCE_MIN ? 0 : min;

const formatDiff = (min: number): string => {
  const sign = min > 0 ? "+" : "-";
  const abs = Math.abs(min);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  if (h === 0) return `${sign}${m}м`;
  if (m === 0) return `${sign}${h}ч`;
  return `${sign}${h}ч ${String(m).padStart(2, "0")}м`;
};

const diffColor = (min: number) =>
  min < 0 ? "text-red-500" : "text-green-600";

export default function DiffTipsOver({
  dataTips,
  dataSchedule,
}: {
  dataTips: GetTipsAddData[] | null;
  dataSchedule: GetScheduleData | null;
}) {
  const { monthDays, year, month } = useMonthDays();
  const monthIndex = MONTHS.indexOf(month); // 0-based, "november" -> 10

  const days = monthDays.map((d) => d.day);

  const names =
    dataSchedule?.rowShifts?.map((r) => ({
      name: r.employee.trim(),
      id: r.employeeId,
    })) ?? [];

  const shiftsByName = useMemo(
    () =>
      new Map<string, string[]>(
        dataSchedule?.rowShifts?.map(
          (r) => [r.employee.trim(), r.shifts] as [string, string[]],
        ) ?? [],
      ),
    [dataSchedule],
  );

  const findEntry = (dayId: number, employeeId: string) =>
    dataTips
      ?.find((d) => d.id === dayId.toString())
      ?.tipsAdd.find((t) => t.idEmployee === employeeId);

  function getTipShiftStart(dayId: number, employeeId: string): number | null {
    const entry = findEntry(dayId, employeeId);
    if (!entry?.shift) return null;

    const [h, m = "0"] = entry.shift.split("-")[0].split(":");
    const start = getTimestamp(
      Number(year),
      monthIndex,
      dayId,
      Number(h),
      Number(m),
    );

    return applyTolerance(
      Math.round((start - Number(entry.createdAt)) / 60000),
    );
  }

  function getTipShiftEnd(dayId: number, employeeId: string): number | null {
    const entry = findEntry(dayId, employeeId);
    if (!entry?.shift || !entry.isClosed || !entry.endDate) return null;

    const [startH] = entry.shift.split("-")[0].split(":");
    const [endH, endM = "0"] = entry.shift.split("-")[1].split(":");

    const crossesMidnight = Number(endH) <= Number(startH);

    const end = getTimestamp(
      Number(year),
      monthIndex,
      dayId + (crossesMidnight ? 1 : 0),
      Number(endH),
      Number(endM),
    );

    return applyTolerance(Math.round((Number(entry.endDate) - end) / 60000));
  }

  const getScheduleExtra = (name: string, day: number): string => {
    const value = shiftsByName.get(name)?.[day - 1];
    if (!value || SHIFT_COLOR_MAP.includes(value)) return "";
    return value
      .split(".")
      .filter((v) => !SHIFTS.bar.includes(v))
      .join(",");
  };

  if (!dataTips || dataTips.length === 0) {
    return (
      <div className="text-muted-foreground p-4 text-sm">
        Нет данных по чаевым
      </div>
    );
  }

  if (!dataSchedule) {
    return (
      <div className="text-muted-foreground p-4 text-sm">
        Загрузка графика...
      </div>
    );
  }

  return (
    <Table className="mt-8 table-auto">
      <TableHeader>
        <TableRow>
          <TableHead />
          <TableHead className="bg-background sticky left-0 z-10 w-30 truncate pr-1 pl-2 text-xs">
            schedule - tips
          </TableHead>

          {days.map((day) => (
            <TableHead
              key={day}
              className="text-bl w-8.5 border-0 p-0 text-center text-xs"
            >
              {day}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {names.map((n, i) => (
          <TableRow
            key={n.id}
            className={cn(
              "group cursor-pointer",
              "[&>td]:p-0 [&>td]:py-1 [&>td]:text-xs [&>td]:transition-colors",
              "hover:[&>td]:bg-muted",
            )}
          >
            <TableCell className="text-rd w-6 text-[11px]!">{i + 1}</TableCell>
            <TableCell className="bg-background group-hover:text-gn sticky left-0 z-10 w-32 truncate pl-1 text-[11px]!">
              {n.name}
            </TableCell>

            {days.map((d) => {
              const extra = getScheduleExtra(n.name, d);
              const diff = getTipShiftStart(d, n.id);
              const diffEnd = getTipShiftEnd(d, n.id);

              return (
                <TableCell
                  key={d}
                  className="group-hover:text-gn w-12.5 border-x p-0 text-center text-xs"
                >
                  <div className="flex flex-row items-center justify-center gap-1">
                    <span className="text-gn text-[11px]">{extra}</span>

                    {(diff || diffEnd) && (
                      <div className="divide-border flex flex-col divide-y text-[10px]">
                        <div
                          className={cn(
                            "min-h-3.5 px-0.5 leading-3.5 whitespace-nowrap",
                            diff ? diffColor(diff) : "",
                          )}
                        >
                          {diff ? formatDiff(diff) : ""}
                        </div>
                        <div
                          className={cn(
                            "min-h-3.5 px-0.5 leading-3.5 whitespace-nowrap",
                            diffEnd ? diffColor(diffEnd) : "",
                          )}
                        >
                          {diffEnd ? formatDiff(diffEnd) : ""}
                        </div>
                      </div>
                    )}
                  </div>
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
