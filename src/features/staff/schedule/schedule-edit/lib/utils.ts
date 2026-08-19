import { Employee } from "@/features/settings/create-employee/model/type";
import { MONTHS } from "@/utils/get-month-days";
import {
  SHIFT_HOURS_MAP_DAY,
  SHIFT_HOURS_MAP_NIGHT,
  SHIFT_OPTIONS,
} from "../model/constants";
import { ScheduleType } from "../model/schema";
import { ShiftCounts } from "../model/type";

export function getShiftCounts(
  rowShifts: ScheduleType["rowShifts"],
): ShiftCounts | null {
  if (!rowShifts?.length) return null;

  const daysCount = rowShifts[0]?.shifts?.length || 0;

  const result = Object.fromEntries(
    SHIFT_OPTIONS.map((s) => [s, Array(daysCount).fill(0)]),
  );

  rowShifts.forEach((row) => {
    row.shifts.forEach((shiftValue, dayIndex) => {
      const parts = shiftValue.split(".");
      const matchedPart = parts.find((part) => SHIFT_OPTIONS.includes(part));
      if (matchedPart) {
        result[matchedPart][dayIndex] += 1;
      }
    });
  });

  const hasData = Object.values(result).some((arr) =>
    arr.some((value) => value > 0),
  );

  return hasData ? result : null;
}

export function isCanEdit({ year, month }: { year: string; month: string }) {
  const monthIndex = MONTHS.indexOf(month);
  const editDate = new Date(parseInt(year), monthIndex, 1);
  const currentDate = new Date();
  const diffDays =
    (currentDate.getTime() - editDate.getTime()) / (1000 * 60 * 60 * 24);
  const canEdit = editDate >= currentDate || (diffDays >= 0 && diffDays <= 41);
  return canEdit;
}

export function calculateSalaryByHours(row: ScheduleType["rowShifts"][number]) {
  const rate = Number(row.rate);
  const dayHours = Number(row.dayHours);
  const nightHours = Number(row.nightHours);

  const safeRate = Number.isFinite(rate) ? rate : 0;
  const safeDay = Number.isFinite(dayHours) ? dayHours : 0;
  const safeNight = Number.isFinite(nightHours) ? nightHours : 0;

  const base = safeRate / 186;
  const dayHourPay = row.role === "mngr" ? base : base * 0.9;
  const nightHourPay = row.role === "mngr" ? base : base * 1.15;

  return dayHourPay * safeDay + nightHourPay * safeNight;
}

export function calculateShiftTotals(shifts: string[]) {
  const dayHours = (shifts || []).reduce(
    (sum, val) => sum + (SHIFT_HOURS_MAP_DAY[val] ?? 0),
    0,
  );
  const nightHours = (shifts || []).reduce(
    (sum, val) => sum + (SHIFT_HOURS_MAP_NIGHT[val] ?? 0),
    0,
  );
  const total = dayHours + nightHours;

  return { totalDay: dayHours, totalNight: nightHours, total };
}

export function createEmptyRowShifts(employees: Employee[], daysCount: number) {
  return employees.map((emp, index) => ({
    id: index.toString(),
    dayHours: "",
    nightHours: "",
    totalHours: "",
    salary: "",
    employee: emp.name,
    role: emp.role,
    rate: emp.rate,
    employeeId: emp.id,
    shifts: Array(daysCount).fill(""),
  }));
}
