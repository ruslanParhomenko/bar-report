import { SchedulesContextValue } from "@/providers/ScheduleProvider";
import {
  EMPLOYEE_ROLES_BY_DEPARTMENT,
  SHIFT_OPTIONS,
} from "./create/constants";
import { MONTHS } from "@/utils/getMonthDays";
import { useEmployees } from "@/providers/EmployeesProvider";
import { useAbility } from "@/providers/AbilityProvider";

// getShiftCounts
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
  row: SchedulesContextValue["rowShifts"][number]
) {
  const dayHourPay =
    row.role === "mngr"
      ? Number(row.rate) / 186
      : (Number(row.rate) / 186) * 0.9;
  const nightHourPay =
    row.role === "mngr"
      ? Number(row.rate) / 186
      : (Number(row.rate) / 186) * 1.15;
  const salaryByHours =
    dayHourPay * Number(row.dayHours) + nightHourPay * Number(row.nightHours);
  return salaryByHours;
}

// selectedEmployeesByRole
export function getSelectedEmployeesByRole(
  patch: keyof typeof EMPLOYEE_ROLES_BY_DEPARTMENT
) {
  const employees = useEmployees();
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
