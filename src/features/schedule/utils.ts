import {
  EMPLOYEE_ROLES_BY_DEPARTMENT,
  SHIFT_OPTIONS,
} from "./create/constants";
import { MONTHS } from "@/utils/get-month-days";
import { useEmployees } from "@/providers/employees-provider";
import { SchedulesContextValue } from "@/app/actions/schedule/schedule-action";

// getShiftCounts
export function getShiftCounts(rowShifts: SchedulesContextValue["rowShifts"]) {
  if (!rowShifts?.length) return {};

  const daysCount = rowShifts[0]?.shifts?.length || 0;

  const result = Object.fromEntries(
    SHIFT_OPTIONS.map((s) => [s, Array(daysCount).fill(0)]),
  );

  rowShifts.forEach((row) => {
    row.shifts.forEach((shiftValue: string, dayIndex: number) => {
      if (SHIFT_OPTIONS.includes(shiftValue)) {
        result[shiftValue][dayIndex] += 1;
      }
    });
  });

  return result;
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
