import type { GetScheduleData } from "@/app/actions/schedule/schedule-action";
import type { GetTipsData } from "@/app/actions/tips/tips-action";
import { MONTHS } from "@/utils/get-month-days";
import { ROLE, ROLE_EMPLOYEES } from "./constants";
import type { MonthData } from "./types";

export const round5 = (v: number) => Math.round(v / 5) * 5;

export function findScheduleRow(
  dataSchedules:
    { month: string; data: GetScheduleData[] }[] | null | undefined,
  monthId: string,
  roleKey: string,
  roleEmployees: string,
  employee: string,
) {
  const monthSchedule = dataSchedules?.find((item) => item.month === monthId);

  return monthSchedule?.data
    .filter((item) => item.id === roleKey)
    .flatMap((item) => item.rowShifts)
    .find(
      (item) =>
        item.role === roleEmployees && item.employee.trim() === employee.trim(),
    );
}

export function getBarmenHoursByMonth(
  dataSchedules: { month: string; data: GetScheduleData[] }[] | null,
  monthId: string,
) {
  const monthData = dataSchedules?.find((item) => item.month === monthId);
  const shifts =
    monthData?.data
      .filter((item) => item.id === "bar")
      .flatMap((item) => item.rowShifts)
      .filter((item) => item.role === "barmen") || [];

  const dayHours = shifts.reduce((acc, b) => acc + Number(b.dayHours || 0), 0);
  const nightHours = shifts.reduce(
    (acc, b) => acc + Number(b.nightHours || 0),
    0,
  );
  const totalHours = dayHours + nightHours;
  const coefficientDayNight = totalHours > 0 ? dayHours / totalHours : 0;

  return { totalHours, coefficientDayNight };
}

export function getWaitersTipsByMonth(
  tipsDataYear: GetTipsData[] | null,
  monthId: string,
) {
  const monthTips = tipsDataYear?.find((item) => item.id === monthId)?.tipsData;

  return (
    monthTips?.rowEmployeesTips
      ?.filter((w) => w.role === "waiters")
      .reduce((acc, w) => {
        const sumTipsByDay = w.tipsByDay
          .map((t) => Number(t) || 0)
          .reduce((sum, t) => sum + t, 0);
        return acc + sumTipsByDay;
      }, 0) || 0
  );
}

export function calculateWaitersNetTips(
  tipsMonth: GetTipsData | undefined,
  employee: string,
) {
  if (!tipsMonth) return 0;

  const percentTips = Number(tipsMonth.tipsData?.percentTips) || 0;
  const waitersDishBid = Number(tipsMonth.tipsData?.waitersDishBid) || 0;

  const totalTips =
    tipsMonth.tipsData?.rowEmployeesTips
      .filter((item) => item.role === "waiters")
      .filter((item) => item.employee.trim() === employee.trim())
      .flatMap((item) => item.tipsByDay)
      .reduce((acc, item) => acc + Number(item), 0) || 0;

  return round5(
    totalTips - totalTips * waitersDishBid - totalTips * percentTips,
  );
}

export function calculateBarmenNetTips({
  tipsMonth,
  employee,
  monthId,
  year,
  dayHours,
  nightHours,
  dataSchedules,
  tipsDataYear,
}: {
  tipsMonth: GetTipsData | undefined;
  employee: string;
  monthId: string;
  year: string;
  dayHours: number;
  nightHours: number;
  dataSchedules: { month: string; data: GetScheduleData[] }[] | null;
  tipsDataYear: GetTipsData[] | null;
}) {
  if (!tipsMonth) return 0;

  const monthNumber = MONTHS.findIndex(
    (m) => m.toLowerCase() === monthId.toLowerCase(),
  );
  const daysInMonth = new Date(Number(year), monthNumber + 1, 0).getDate();
  const maxHours = daysInMonth * 24;

  const { totalHours: barmenHoursThisMonth, coefficientDayNight } =
    getBarmenHoursByMonth(dataSchedules, monthId);

  const constantHoursByMonth = Math.max(maxHours, barmenHoursThisMonth);

  const percentTips = Number(tipsMonth.tipsData?.percentTips) || 0;
  const percentBarmen = Number(tipsMonth.tipsData?.percentBarmen) || 0;
  const barmenDishBid = Number(tipsMonth.tipsData?.barmenDishBid) || 0;

  const waitersTipsThisMonth = getWaitersTipsByMonth(tipsDataYear, monthId);
  const tipsForBarmen = waitersTipsThisMonth * percentTips * percentBarmen;
  const coefficientBarmen = tipsForBarmen / (constantHoursByMonth || 1);

  const ownTips =
    tipsMonth.tipsData?.rowEmployeesTips
      .filter((item) => item.role === "barmen")
      .filter((item) => item.employee.trim() === employee.trim())
      .flatMap((item) => item.tipsByDay)
      .reduce((acc, item) => acc + Number(item), 0) || 0;

  const tipsByWaiters =
    dayHours * coefficientBarmen -
    dayHours * coefficientBarmen * 0.1 +
    nightHours * coefficientBarmen +
    nightHours * coefficientBarmen * 0.1 * coefficientDayNight;

  return round5(
    ownTips + tipsByWaiters - (ownTips + tipsByWaiters) * barmenDishBid,
  );
}

export function getEmployeeMonthData({
  employee,
  monthId,
  role,
  year,
  dataSchedulesRange,
  dataTipsRange,
  dataSchedulesFull,
  tipsDataYearFull,
}: {
  employee: string;
  monthId: string;
  role: string;
  year: string;
  dataSchedulesRange: { month: string; data: GetScheduleData[] }[] | null;
  dataTipsRange: GetTipsData[];
  dataSchedulesFull: { month: string; data: GetScheduleData[] }[] | null;
  tipsDataYearFull: GetTipsData[] | null;
}): MonthData {
  const roleKey = ROLE[role as keyof typeof ROLE];
  const roleEmployees = ROLE_EMPLOYEES[role as keyof typeof ROLE_EMPLOYEES];

  const scheduleRow = findScheduleRow(
    dataSchedulesRange,
    monthId,
    roleKey,
    roleEmployees,
    employee,
  );

  if (!scheduleRow) {
    return { rate: 0, hours: 0, salary: 0, tips: 0, total: 0 };
  }

  const salary = Number(scheduleRow.salary) || 0;
  const hours = Number(scheduleRow.totalHours) || 0;
  const rate = Number(scheduleRow.rate) / 1000 || 0;

  const tipsMonth = dataTipsRange.find((item) => item.id === monthId);
  let tips = 0;

  if (roleEmployees === "waiters") {
    tips = calculateWaitersNetTips(tipsMonth, employee);
  }

  if (roleEmployees === "barmen") {
    tips = calculateBarmenNetTips({
      tipsMonth,
      employee,
      monthId,
      year,
      dayHours: Number(scheduleRow.dayHours) || 0,
      nightHours: Number(scheduleRow.nightHours) || 0,
      dataSchedules: dataSchedulesFull,
      tipsDataYear: tipsDataYearFull,
    });
  }

  return { rate, hours, salary, tips, total: salary + tips };
}
