"use client";
import { GetScheduleData } from "@/app/actions/schedule/schedule-action";
import { GetTipsData } from "@/app/actions/tips/tips-action";
import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import {
  MonthPicker,
  MonthRange,
} from "@/components/input-controlled/month-range";
import NavTabs from "@/components/nav-tabs/nav-tabs";
import { cn } from "@/lib/utils";
import { useEmployees } from "@/providers/employees-provider";
import { MONTHS } from "@/utils/get-month-days";
import { monthsSince } from "@/utils/month-since";
import { TrashIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const ROLE = {
  barmen: "bar",
  waiters: "bar",
  dish: "dish",
  cucina: "cucina",
};
const ROLE_EMPLOYEES = {
  barmen: "barmen",
  waiters: "waiters",
  dish: "dish",
  cucina: "cook",
};
type ChartDataItem = {
  name: string;
  salary: number;
  tips: number;
  total: number;
  hours: number;
  rate: number;
  workedMonths: number;
};

type BarKey = keyof Omit<ChartDataItem, "name">;
type BarItem = {
  key: BarKey;
  color: string;
  label: string;
};

const NAV_TABS = ["employees", "month"];

export default function ChartResultPage({
  dataSchedules,
  tipsDataYear,
  year,
}: {
  dataSchedules: { month: string; data: GetScheduleData[] }[] | null;
  tipsDataYear: GetTipsData[] | null;
  year: string;
}) {
  const role = useSearchParams().get("tab") || "barmen";

  const [filters, setFilters] = useState<"employees" | "month">("employees");
  const [activeName, setActiveName] = useState<string>("");

  const allEmployees = useEmployees();

  console.log("allEmployees", allEmployees);

  const roleKey = ROLE[role as keyof typeof ROLE];
  const roleEmployees = ROLE_EMPLOYEES[role as keyof typeof ROLE_EMPLOYEES];

  const scheduleEmployees =
    dataSchedules
      ?.flatMap((item) => item.data)
      .filter((item) => item.id === roleKey && true)
      .flatMap((item) => item.rowShifts)
      .filter((item) => item.role === roleEmployees)
      .map((item) => item.employee) ?? [];

  const uniqueEmployees = Array.from(new Set(scheduleEmployees));
  const sortedEmployees = uniqueEmployees.sort((a, b) => a.localeCompare(b));

  const [visibleBars, setVisibleBars] = useState<Record<BarKey, boolean>>({
    salary: false,
    tips: false,
    total: true,
    hours: false,
    rate: false,
    workedMonths: false,
  });
  const [range, setRange] = useState<MonthRange>();
  const getMonthIndex = (id: string) => MONTHS.indexOf(id);

  const dataSchedulesPrevMonth = (() => {
    if (range?.from === undefined || range?.to === undefined) {
      return dataSchedules;
    }

    const from = range.from;
    const to = range.to;

    return (
      dataSchedules?.filter((data) => {
        const idx = getMonthIndex(data.month);
        return idx >= from && idx <= to;
      }) || []
    );
  })();

  const dataTipsPrevMonth = (() => {
    if (range?.from === undefined || range?.to === undefined) {
      return tipsDataYear || [];
    }

    const from = range.from;
    const to = range.to;

    return (
      tipsDataYear?.filter((data) => {
        const idx = getMonthIndex(data.id);
        return idx >= from && idx <= to;
      }) || []
    );
  })();

  const getBarmenHoursByMonth = (monthId: string) => {
    const monthData = dataSchedules?.find((item) => item.month === monthId);
    const shifts =
      monthData?.data
        .filter((item) => item.id === "bar")
        .flatMap((item) => item.rowShifts)
        .filter((item) => item.role === "barmen") || [];

    const dayHours = shifts.reduce(
      (acc, b) => acc + Number(b.dayHours || 0),
      0,
    );
    const nightHours = shifts.reduce(
      (acc, b) => acc + Number(b.nightHours || 0),
      0,
    );
    const totalHours = dayHours + nightHours;
    const coefficientDayNight = totalHours > 0 ? dayHours / totalHours : 0;

    return { totalHours, coefficientDayNight };
  };

  const getWaitersTipsByMonth = (monthId: string) => {
    const monthTips = tipsDataYear?.find(
      (item) => item.id === monthId,
    )?.tipsData;
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
  };

  const round5 = (v: number) => Math.round(v / 5) * 5;

  const chartDataByEmployee: ChartDataItem[] = sortedEmployees.map((name) => {
    let totalTipsByEmployee = 0;

    const rateByEmployee = dataSchedulesPrevMonth
      ?.flatMap((item) => item.data)
      .filter((item) => item.id === ROLE[role as keyof typeof ROLE])
      .flatMap((item) => item.rowShifts)
      .filter((item) => item.role === roleEmployees)
      .filter((item) => item.employee.trim() === name.trim())
      .at(-1)?.rate;

    const idEmployee = dataSchedulesPrevMonth
      ?.flatMap((item) => item.data)
      .filter((item) => item.id === ROLE[role as keyof typeof ROLE])
      .flatMap((item) => item.rowShifts)
      .filter((item) => item.role === roleEmployees)
      .filter((item) => item.employee.trim() === name.trim())
      .at(-1)?.employeeId;

    const employmentDate = allEmployees.find(
      (item) => item.id === idEmployee,
    )?.employmentDate;

    const salaryByEmployee = dataSchedulesPrevMonth
      ?.flatMap((item) => item.data)
      .filter((item) => item.id === ROLE[role as keyof typeof ROLE])
      .flatMap((item) => item.rowShifts)
      .filter((item) => item.role === roleEmployees)
      .filter((item) => item.employee.trim() === name.trim())
      .reduce((acc, item) => acc + Number(item.salary), 0);

    const totalHoursByEmployee = dataSchedulesPrevMonth
      ?.flatMap((item) => item.data)
      .filter((item) => item.id === ROLE[role as keyof typeof ROLE])
      .flatMap((item) => item.rowShifts)
      .filter((item) => item.role === roleEmployees)
      .filter((item) => item.employee.trim() === name.trim())
      .reduce((acc, item) => acc + Number(item.totalHours), 0);

    if (roleEmployees === "waiters") {
      dataTipsPrevMonth.map((item) => {
        const percentTips = Number(item.tipsData?.percentTips) || 0;
        const waitersDishBid = Number(item.tipsData?.waitersDishBid) || 0;

        const totalTipsMonthByEmployee =
          item.tipsData?.rowEmployeesTips
            .filter((item) => item.role === "waiters")
            .filter((item) => item.employee.trim() === name.trim())
            .flatMap((item) => item.tipsByDay)
            .reduce((acc, item) => acc + Number(item), 0) || 0;

        const totalTipsMonthByEmployeeWithoutWaitersDishBid = round5(
          totalTipsMonthByEmployee -
            totalTipsMonthByEmployee * waitersDishBid -
            totalTipsMonthByEmployee * percentTips,
        );
        totalTipsByEmployee += totalTipsMonthByEmployeeWithoutWaitersDishBid;
      });
    }

    if (roleEmployees === "barmen") {
      totalTipsByEmployee = 0;
      dataTipsPrevMonth.map((item) => {
        const monthId = item.id;

        const monthNumber = MONTHS.findIndex(
          (m) => m.toLowerCase() === monthId?.toLowerCase(),
        );
        const daysInMonth = new Date(
          Number(year),
          monthNumber + 1,
          0,
        ).getDate();
        const maxHours = daysInMonth * 24;

        const { totalHours: barmenHoursThisMonth, coefficientDayNight } =
          getBarmenHoursByMonth(monthId);

        const constantHoursByMonth =
          maxHours > barmenHoursThisMonth ? maxHours : barmenHoursThisMonth;

        const percentTips = Number(item.tipsData?.percentTips) || 0;
        const percentBarmen = Number(item.tipsData?.percentBarmen) || 0;
        const barmenDishBid = Number(item.tipsData?.barmenDishBid) || 0;

        const waitersTipsThisMonth = getWaitersTipsByMonth(monthId);

        const tipsForBarmen =
          waitersTipsThisMonth * percentTips * percentBarmen;
        const coefficientBarmen =
          (tipsForBarmen ?? 0) / (constantHoursByMonth || 1);

        const totalTipsMonthByEmployee =
          item.tipsData?.rowEmployeesTips
            .filter((item) => item.role === "barmen")
            .filter((item) => item.employee.trim() === name.trim())
            .flatMap((item) => item.tipsByDay)
            .reduce((acc, item) => acc + Number(item), 0) || 0;

        const scheduleRow = dataSchedules // берём из полного расписания за этот конкретный месяц
          ?.filter((data) => data.month === monthId)
          .flatMap((data) => data.data)
          .filter((item) => item.id === "bar")
          .flatMap((item) => item.rowShifts)
          .filter((item) => item.employee.trim() === name.trim())[0];

        const dayH = Number(scheduleRow?.dayHours) || 0;
        const nightH = Number(scheduleRow?.nightHours) || 0;

        const tipsByWaiters =
          dayH * coefficientBarmen -
          dayH * coefficientBarmen * 0.1 +
          nightH * coefficientBarmen +
          nightH * coefficientBarmen * 0.1 * coefficientDayNight;

        const totalTipsMonthByEmployeeWithoutWaitersDishBid = round5(
          totalTipsMonthByEmployee +
            tipsByWaiters -
            (totalTipsMonthByEmployee + tipsByWaiters) * barmenDishBid,
        );
        totalTipsByEmployee += totalTipsMonthByEmployeeWithoutWaitersDishBid;
      });
    }

    const totalPay = (salaryByEmployee ?? 0) + (totalTipsByEmployee ?? 0);
    const workedMonthsByEmployee = monthsSince(employmentDate);

    return {
      name: name.split(" ")[0] + "." + (name.split(" ")[1]?.[0] ?? ""),
      salary: salaryByEmployee ?? 0,
      tips: totalTipsByEmployee ?? 0,
      total: totalPay,
      hours: totalHoursByEmployee ?? 0,
      rate: Number(rateByEmployee) || 0,
      workedMonths: Number(workedMonthsByEmployee) ?? 0,
    };
  });

  const chartDataByMonth: ChartDataItem[] = !activeName
    ? []
    : MONTHS.map((monthId) => {
        let totalTipsByEmployee = 0;

        const monthSchedule = dataSchedules?.find(
          (item) => item.month === monthId,
        );

        const scheduleRow = monthSchedule?.data
          .filter((item) => item.id === ROLE[role as keyof typeof ROLE])
          .flatMap((item) => item.rowShifts)
          .find(
            (item) =>
              item.role === roleEmployees &&
              item.employee.trim() === activeName.trim(),
          );

        const salaryByEmployee = Number(scheduleRow?.salary) || 0;
        const totalHoursByEmployee = Number(scheduleRow?.totalHours) || 0;

        const tipsMonth = tipsDataYear?.find((item) => item.id === monthId);

        if (roleEmployees === "waiters" && tipsMonth) {
          const percentTips = Number(tipsMonth.tipsData?.percentTips) || 0;
          const waitersDishBid =
            Number(tipsMonth.tipsData?.waitersDishBid) || 0;

          const totalTips =
            tipsMonth.tipsData?.rowEmployeesTips
              .filter((item) => item.role === "waiters")
              .filter((item) => item.employee.trim() === activeName.trim())
              .flatMap((item) => item.tipsByDay)
              .reduce((acc, item) => acc + Number(item), 0) || 0;

          totalTipsByEmployee = round5(
            totalTips - totalTips * waitersDishBid - totalTips * percentTips,
          );
        }

        if (roleEmployees === "barmen" && tipsMonth) {
          const monthNumber = MONTHS.findIndex(
            (m) => m.toLowerCase() === monthId.toLowerCase(),
          );

          const daysInMonth = new Date(
            Number(year),
            monthNumber + 1,
            0,
          ).getDate();

          const maxHours = daysInMonth * 24;

          const { totalHours: barmenHoursThisMonth, coefficientDayNight } =
            getBarmenHoursByMonth(monthId);

          const constantHoursByMonth = Math.max(maxHours, barmenHoursThisMonth);

          const percentTips = Number(tipsMonth.tipsData?.percentTips) || 0;
          const percentBarmen = Number(tipsMonth.tipsData?.percentBarmen) || 0;
          const barmenDishBid = Number(tipsMonth.tipsData?.barmenDishBid) || 0;

          const waitersTipsThisMonth = getWaitersTipsByMonth(monthId);

          const tipsForBarmen =
            waitersTipsThisMonth * percentTips * percentBarmen;

          const coefficientBarmen = tipsForBarmen / (constantHoursByMonth || 1);

          const ownTips =
            tipsMonth.tipsData?.rowEmployeesTips
              .filter((item) => item.role === "barmen")
              .filter((item) => item.employee.trim() === activeName.trim())
              .flatMap((item) => item.tipsByDay)
              .reduce((acc, item) => acc + Number(item), 0) || 0;

          const dayH = Number(scheduleRow?.dayHours) || 0;
          const nightH = Number(scheduleRow?.nightHours) || 0;

          const tipsByWaiters =
            dayH * coefficientBarmen -
            dayH * coefficientBarmen * 0.1 +
            nightH * coefficientBarmen +
            nightH * coefficientBarmen * 0.1 * coefficientDayNight;

          totalTipsByEmployee = round5(
            ownTips + tipsByWaiters - (ownTips + tipsByWaiters) * barmenDishBid,
          );
        }

        const workedMonths = 0;

        return {
          name: monthId,
          salary: salaryByEmployee,
          tips: totalTipsByEmployee,
          total: salaryByEmployee + totalTipsByEmployee,
          hours: totalHoursByEmployee,
          rate: Number(scheduleRow?.rate) || 0,
          workedMonths: Number(workedMonths) || 0,
        };
      });

  const BAR_KEYS: BarItem[] = [
    { key: "salary", color: "var(--color-gn)", label: "Salary" },
    { key: "tips", color: "var(--color-rd)", label: "Tips" },
    { key: "total", color: "var(--color-bl)", label: "Total" },
    { key: "hours", color: "var(--color-primary)", label: "Hours" },
    { key: "rate", color: "var(--color-yl)", label: "Rate" },
    { key: "workedMonths", color: "var(--color-yl)", label: "Worked months" },
  ];
  const toggleBar = (key: BarKey) => {
    setVisibleBars((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const CHART_DATA_BY_FILTERS = {
    employees: chartDataByEmployee,
    month: chartDataByMonth,
  };

  const chartData = CHART_DATA_BY_FILTERS[filters];
  return (
    <>
      <div className="flex items-center justify-center gap-6 p-1">
        <NavTabs
          navItems={NAV_TABS}
          activeTab={filters}
          handleTabChange={(value) =>
            setFilters(value as "employees" | "month")
          }
        />
        {filters === "employees" && (
          <MonthPicker value={range} onChange={setRange} />
        )}
        <button
          disabled={!range}
          type="button"
          onClick={() => setRange(undefined)}
          className="w-4"
        >
          {range && <TrashIcon className="text-rd h-4 w-4" />}
        </button>
      </div>
      <CustomChart
        chartData={chartData.filter((data) => data.total > 0)}
        barItem={BAR_KEYS.filter(({ key }) => visibleBars[key as BarKey])}
        className="h-[70dvh]"
        vertical={chartData.length > 20}
      />
      <CustomLegend
        items={BAR_KEYS}
        visibleItems={visibleBars}
        onToggle={toggleBar}
      />
      <div className="flex flex-wrap justify-center gap-1 md:px-4 md:pb-2">
        {filters === "month" &&
          uniqueEmployees.map((name) => (
            <span
              key={name}
              onClick={() =>
                setActiveName((prev) => (prev === name ? "" : name))
              }
              className={cn(
                "cursor-pointer rounded-full px-1 py-1 text-xs transition-opacity md:px-3",
                activeName && activeName !== name && "opacity-35",
                activeName !== name && "print:hidden",
              )}
            >
              {name}
            </span>
          ))}
      </div>
    </>
  );
}
