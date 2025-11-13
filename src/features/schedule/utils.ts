import { SchedulesContextValue } from "@/providers/ScheduleProvider";
import { SHIFT_OPTIONS } from "./create/constants";

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
