"use client";

import type { MonthRange } from "@/components/input-controlled/month-range";
import { GetScheduleData } from "@/features/schedule/schedule-edit/model/type";
import { GetTipsData } from "@/features/staff/tips/model/type";
import { MONTHS } from "@/utils/get-month-days";
import { monthsSince } from "@/utils/month-since";
import { useState } from "react";

import {
  calculateBarmenNetTips,
  calculateWaitersNetTips,
  findScheduleRow,
  getEmployeeMonthData,
} from "@/features/chart/chart-result/lib/calculate-pay";
import {
  ROLE,
  ROLE_CHART_EMPLOYEES,
} from "@/features/chart/chart-result/model/constants";
import {
  ChartResultDataInput,
  EmployeeTableRow,
} from "@/features/chart/chart-result/model/type";

export function useChartResultData({
  dataSchedules,
  tipsDataYear,
  employees,
  year,
  role,
}: ChartResultDataInput) {
  const allEmployees = employees;

  const [range, setRange] = useState<MonthRange>();
  const [activeName, setActiveName] = useState<string>("");

  const roleKey = ROLE[role as keyof typeof ROLE];
  const roleEmployees =
    ROLE_CHART_EMPLOYEES[role as keyof typeof ROLE_CHART_EMPLOYEES];

  const getMonthIndex = (id: string) => MONTHS.indexOf(id);

  const scheduleEmployees =
    dataSchedules
      ?.flatMap((item) => item.data)
      .filter((item) => item.id === roleKey)
      .flatMap((item) => item.rowShifts)
      .filter((item) => item.role === roleEmployees)
      .map((item) => item.employee) ?? [];

  const uniqueEmployees = Array.from(new Set(scheduleEmployees));
  const sortedEmployees = uniqueEmployees.sort((a, b) => a.localeCompare(b));

  const rangeFrom = range?.from;
  const rangeTo = range?.to;

  const dataSchedulesPrevMonth:
    { month: string; data: GetScheduleData[] }[] | null =
    rangeFrom === undefined || rangeTo === undefined
      ? dataSchedules
      : (dataSchedules?.filter((data) => {
          const idx = getMonthIndex(data.month);
          return idx >= rangeFrom && idx <= rangeTo;
        }) ?? []);

  const dataTipsPrevMonth: GetTipsData[] =
    rangeFrom === undefined || rangeTo === undefined
      ? tipsDataYear || []
      : (tipsDataYear?.filter((data) => {
          const idx = getMonthIndex(data.id);
          return idx >= rangeFrom && idx <= rangeTo;
        }) ?? []);

  const monthsToDisplay =
    range?.from === undefined || range?.to === undefined
      ? MONTHS
      : MONTHS.slice(range.from, range.to + 1);

  const tableData: EmployeeTableRow[] = sortedEmployees.map((employee) => {
    const row: EmployeeTableRow = {
      employee:
        employee.split(" ")[0] + "." + (employee.split(" ")[1]?.[0] ?? ""),
    };

    MONTHS.forEach((month) => {
      row[month] = getEmployeeMonthData({
        employee,
        monthId: month,
        role,
        year,
        dataSchedulesRange: dataSchedulesPrevMonth,
        dataTipsRange: dataTipsPrevMonth,
        dataSchedulesFull: dataSchedules,
        tipsDataYearFull: tipsDataYear,
      });
    });

    return row;
  });

  const chartDataByEmployee = sortedEmployees.map((name) => {
    const employeeRows = dataSchedulesPrevMonth
      ?.flatMap((item) => item.data)
      .filter((item) => item.id === roleKey)
      .flatMap((item) => item.rowShifts)
      .filter((item) => item.role === roleEmployees)
      .filter((item) => item.employee.trim() === name.trim());

    const rateByEmployee = employeeRows?.at(-1)?.rate;
    const idEmployee = employeeRows?.at(-1)?.employeeId;

    const employmentDate = allEmployees.find(
      (item) => item.id === idEmployee,
    )?.employmentDate;

    const salaryByEmployee =
      employeeRows?.reduce((acc, item) => acc + Number(item.salary), 0) ?? 0;
    const totalHoursByEmployee =
      employeeRows?.reduce((acc, item) => acc + Number(item.totalHours), 0) ??
      0;

    let totalTipsByEmployee = 0;

    if (roleEmployees === "waiters") {
      totalTipsByEmployee = dataTipsPrevMonth.reduce(
        (acc, item) => acc + calculateWaitersNetTips(item, name),
        0,
      );
    }

    if (roleEmployees === "barmen") {
      totalTipsByEmployee = dataTipsPrevMonth.reduce((acc, item) => {
        const monthId = item.id;
        const scheduleRow = findScheduleRow(
          dataSchedules,
          monthId,
          "bar",
          "barmen",
          name,
        );

        return (
          acc +
          calculateBarmenNetTips({
            tipsMonth: item,
            employee: name,
            monthId,
            year,
            dayHours: Number(scheduleRow?.dayHours) || 0,
            nightHours: Number(scheduleRow?.nightHours) || 0,
            dataSchedules,
            tipsDataYear,
          })
        );
      }, 0);
    }

    const totalPay = salaryByEmployee + totalTipsByEmployee;
    const workedMonthsByEmployee = monthsSince(employmentDate);

    return {
      name: name.split(" ")[0] + "." + (name.split(" ")[1]?.[0] ?? ""),
      salary: salaryByEmployee,
      tips: totalTipsByEmployee,
      total: totalPay,
      hours: totalHoursByEmployee,
      rate: Number(rateByEmployee) || 0,
      workedMonths: Number(workedMonthsByEmployee) ?? 0,
    };
  });

  const chartDataByMonth = !activeName
    ? []
    : MONTHS.map((monthId) => {
        const scheduleRow = findScheduleRow(
          dataSchedules,
          monthId,
          roleKey,
          roleEmployees,
          activeName,
        );

        const salaryByEmployee = Number(scheduleRow?.salary) || 0;
        const totalHoursByEmployee = Number(scheduleRow?.totalHours) || 0;

        const tipsMonth = tipsDataYear?.find((item) => item.id === monthId);

        let totalTipsByEmployee = 0;

        if (roleEmployees === "waiters") {
          totalTipsByEmployee = calculateWaitersNetTips(tipsMonth, activeName);
        }

        if (roleEmployees === "barmen") {
          totalTipsByEmployee = calculateBarmenNetTips({
            tipsMonth,
            employee: activeName,
            monthId,
            year,
            dayHours: Number(scheduleRow?.dayHours) || 0,
            nightHours: Number(scheduleRow?.nightHours) || 0,
            dataSchedules,
            tipsDataYear,
          });
        }

        return {
          name: monthId,
          salary: salaryByEmployee,
          tips: totalTipsByEmployee,
          total: salaryByEmployee + totalTipsByEmployee,
          hours: totalHoursByEmployee,
          rate: Number(scheduleRow?.rate) || 0,
          workedMonths: 0,
        };
      });

  return {
    range,
    setRange,
    activeName,
    setActiveName,
    uniqueEmployees,
    sortedEmployees,
    monthsToDisplay,
    dataSchedulesPrevMonth,
    tableData,
    chartDataByEmployee,
    chartDataByMonth,
  };
}
