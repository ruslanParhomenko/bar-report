"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GetRemarksData } from "@/features/penalty/model/type";
import {
  SHIFT_COLOR_MAP,
  SHIFTS,
} from "@/features/schedule/schedule-edit/model/constants";
import { GetScheduleData } from "@/features/schedule/schedule-edit/model/type";
import { useMonthDays } from "@/hooks/use-month-days";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

export default function OverHoursPage({
  dataPenalty,
  dataSchedule,
}: {
  dataPenalty: GetRemarksData[] | null;
  dataSchedule: GetScheduleData | null;
}) {
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const { monthDays, month } = useMonthDays();

  const names = useMemo(
    () => [
      ...new Set(
        dataSchedule?.rowShifts
          ?.map((r) => r.employee?.trim())
          .filter((n): n is string => !!n) ?? [],
      ),
    ],
    [dataSchedule],
  );

  const days = monthDays.map((d) => d.day);

  const hoursMap = useMemo(() => {
    const map = new Map<string, number>();
    dataPenalty?.forEach(({ id, remarks }) =>
      remarks.forEach((r) => {
        const key = `${Number(id)}|${r.name.trim()}`;
        const sum = (Number(r.dayHours) || 0) + (Number(r.nightHours) || 0);
        map.set(key, (map.get(key) ?? 0) + sum);
      }),
    );
    return map;
  }, [dataPenalty]);

  const shiftsByName = useMemo(
    () =>
      new Map<string, string[]>(
        dataSchedule?.rowShifts?.map(
          (r) => [r.employee.trim(), r.shifts] as [string, string[]],
        ) ?? [],
      ),
    [dataSchedule],
  );

  const getScheduleExtra = (name: string, day: number): string => {
    const value = shiftsByName.get(name)?.[day - 1];
    if (!value || SHIFT_COLOR_MAP.includes(value)) return "";
    return value
      .split(".")
      .filter((v) => !SHIFTS.bar.includes(v))
      .join(",");
  };

  return (
    <Table className="mt-8 table-auto">
      <TableHeader>
        <TableRow>
          <TableHead />
          <TableHead />
          {days.map((d) => (
            <TableHead
              key={d}
              className="text-bl border-x border-x-0 py-1 text-center text-xs"
            >
              {d}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {names.map((n, i) => {
          const isSelected = selectedName === n;
          return (
            <TableRow
              key={n}
              className={cn(
                "group cursor-pointer",
                "[&>td]:px-1 [&>td]:py-1.5 [&>td]:text-xs [&>td]:transition-colors",
                "hover:[&>td]:bg-muted",
                isSelected && "[&>td]:bg-border",
              )}
              onClick={() => setSelectedName((prev) => (prev === n ? null : n))}
            >
              <TableCell className={cn(isSelected && "text-rd text-[11px]!")}>
                {i + 1}
              </TableCell>
              <TableCell className={cn(isSelected && "text-rd")}>{n}</TableCell>
              {days.map((d) => {
                const hours = hoursMap.get(`${d}|${n}`) ?? 0;
                const extra = getScheduleExtra(n, d);
                const isEqual = hours === Number(extra);
                return (
                  <TableCell
                    key={d}
                    className={cn(
                      "border-x text-center text-xs",
                      hours < 0 ? "text-rd" : "text-bl",
                      !isEqual && "bg-gr/20!",
                    )}
                  >
                    {hours || ""}
                    {extra && `:${extra}`}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
