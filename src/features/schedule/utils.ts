import { SchedulesContextValue } from "@/app/actions/schedule/schedule-action";
import { useEmployees } from "@/providers/employees-provider";
import { MONTHS } from "@/utils/get-month-days";
import {
  EMPLOYEE_ROLES_BY_DEPARTMENT,
  SHIFT_HOURS_MAP_DAY,
  SHIFT_HOURS_MAP_NIGHT,
  SHIFT_OPTIONS,
} from "./constants";

// getShiftCounts
export function getShiftCounts(
  rowShifts: SchedulesContextValue["rowShifts"],
): ShiftCounts | null {
  if (!rowShifts?.length) return null;

  const daysCount = rowShifts[0]?.shifts?.length || 0;

  const result = Object.fromEntries(
    SHIFT_OPTIONS.map((s) => [s, Array(daysCount).fill(0)]),
  ) as ShiftCounts;

  rowShifts.forEach((row) => {
    row.shifts.forEach((shiftValue: string, dayIndex: number) => {
      if (SHIFT_OPTIONS.includes(shiftValue)) {
        result[shiftValue][dayIndex] += 1;
      }
    });
  });

  const hasData = Object.values(result).some((arr) =>
    arr.some((value) => value > 0),
  );

  return hasData ? result : null;
}

export type ShiftCounts = Record<string, number[]>;

// isCanEdit
export function isCanEdit({ year, month }: { year: string; month: string }) {
  const monthIndex = MONTHS.indexOf(month);
  const editDate = new Date(parseInt(year), monthIndex, 1);
  const currentDate = new Date();
  const diffDays =
    (currentDate.getTime() - editDate.getTime()) / (1000 * 60 * 60 * 24);
  const canEdit = editDate >= currentDate || (diffDays >= 0 && diffDays <= 41);
  return canEdit;
}

// calculateSalaryByHours
export function calculateSalaryByHours(
  row: SchedulesContextValue["rowShifts"][number],
) {
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

// selectedEmployeesByRole
export function getSelectedEmployeesByRole(
  patch: keyof typeof EMPLOYEE_ROLES_BY_DEPARTMENT,
) {
  const employees = useEmployees().filter((e) => e.status === "active");
  const allowedRoles: readonly string[] =
    EMPLOYEE_ROLES_BY_DEPARTMENT[patch] ?? [];

  return employees
    .filter((e) => allowedRoles.includes(e.role))
    .sort((a, b) => {
      const roleA = allowedRoles.indexOf(a.role);
      const roleB = allowedRoles.indexOf(b.role);
      if (roleA !== roleB) return roleA - roleB;
      return a.name.localeCompare(b.name);
    });
}

//
export function calculateShiftTotals(shifts: string[] | undefined) {
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
