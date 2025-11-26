import { SchedulesContextValue } from "@/providers/ScheduleProvider";
import { SHIFT_OPTIONS } from "./create/constants";
import { MONTHS } from "@/utils/getMonthDays";

export function getShiftCounts(schedule: SchedulesContextValue) {
  if (!schedule?.rowShifts?.length) return {};

  const daysCount = schedule.rowShifts[0]?.shifts?.length || 0;

  const result = Object.fromEntries(
    SHIFT_OPTIONS.map((s) => [s, Array(daysCount).fill(0)])
  );

  schedule.rowShifts.forEach((row) => {
    row.shifts.forEach((shiftValue: string, dayIndex: number) => {
      if (SHIFT_OPTIONS.includes(shiftValue)) {
        result[shiftValue][dayIndex] += 1;
      }
    });
  });

  return result;
}

export type ShiftCounts = Record<string, number[]>;

export function isCanEdit({ year, month }: { year: string; month: string }) {
  const monthIndex = MONTHS.indexOf(month);
  const editDate = new Date(parseInt(year), monthIndex, 1);
  const currentDate = new Date();
  const diffDays =
    (currentDate.getTime() - editDate.getTime()) / (1000 * 60 * 60 * 24);
  const canEdit = editDate >= currentDate || (diffDays >= 0 && diffDays <= 41);
  return canEdit;
}
