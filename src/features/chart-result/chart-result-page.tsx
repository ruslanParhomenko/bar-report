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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

type MonthData = {
  r: number;
  hr: number;
  sal: number;
  tips: number;
  t: number;
};

type EmployeeTableRow = {
  employee: string;
  [key: string]: string | MonthData | undefined;
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

const NAV_TABS = ["employees", "month", "table"];
const SUB_HEADERS: (keyof MonthData)[] = ["r", "hr", "sal", "tips", "t"];

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

  const [filters, setFilters] = useState<"employees" | "month" | "table">(
    "employees",
  );
  const [activeName, setActiveName] = useState<string>("");

  const [activeKeyMonthData, setActiveKeyMonthData] = useState<
    Record<keyof MonthData, boolean>
  >({
    r: true,
    hr: true,
    sal: true,
    tips: true,
    t: true,
  });

  const allEmployees = useEmployees();

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

  // Месяцы для отображения в таблице (фильтруются по диапазону)
  const monthsToDisplay = (() => {
    if (range?.from === undefined || range?.to === undefined) {
      return MONTHS;
    }
    return MONTHS.slice(range.from, range.to + 1);
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

  // Функция для получения данных сотрудника по месяцу
  const getEmployeeMonthData = (
    employee: string,
    monthId: string,
  ): MonthData => {
    let tips = 0;
    let sal = 0;
    let hr = 0;
    let r = 0;

    const monthSchedule = dataSchedulesPrevMonth?.find(
      (item) => item.month === monthId,
    );

    if (!monthSchedule) {
      return { r, hr, sal, tips, t: 0 };
    }

    const scheduleRow = monthSchedule.data
      .filter((item) => item.id === ROLE[role as keyof typeof ROLE])
      .flatMap((item) => item.rowShifts)
      .find(
        (item) =>
          item.role === roleEmployees &&
          item.employee.trim() === employee.trim(),
      );

    if (scheduleRow) {
      sal = Number(scheduleRow.salary) || 0;
      hr = Number(scheduleRow.totalHours) || 0;
      r = Number(scheduleRow.rate) / 1000 || 0;

      const tipsMonth = dataTipsPrevMonth.find((item) => item.id === monthId);

      if (roleEmployees === "waiters" && tipsMonth) {
        const percentTips = Number(tipsMonth.tipsData?.percentTips) || 0;
        const waitersDishBid = Number(tipsMonth.tipsData?.waitersDishBid) || 0;

        const totalTips =
          tipsMonth.tipsData?.rowEmployeesTips
            .filter((item) => item.role === "waiters")
            .filter((item) => item.employee.trim() === employee.trim())
            .flatMap((item) => item.tipsByDay)
            .reduce((acc, item) => acc + Number(item), 0) || 0;

        tips = round5(
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
            .filter((item) => item.employee.trim() === employee.trim())
            .flatMap((item) => item.tipsByDay)
            .reduce((acc, item) => acc + Number(item), 0) || 0;

        const dayH = Number(scheduleRow?.dayHours) || 0;
        const nightH = Number(scheduleRow?.nightHours) || 0;

        const tipsByWaiters =
          dayH * coefficientBarmen -
          dayH * coefficientBarmen * 0.1 +
          nightH * coefficientBarmen +
          nightH * coefficientBarmen * 0.1 * coefficientDayNight;

        tips = round5(
          ownTips + tipsByWaiters - (ownTips + tipsByWaiters) * barmenDishBid,
        );
      }
    }

    return {
      r,
      hr,
      sal,
      tips,
      t: sal + tips,
    };
  };

  // Генерируем данные таблицы
  const tableData: EmployeeTableRow[] = sortedEmployees.map((employee) => {
    const row: EmployeeTableRow = {
      employee:
        employee.split(" ")[0] + "." + (employee.split(" ")[1]?.[0] ?? ""),
    };

    MONTHS.forEach((month) => {
      row[month] = getEmployeeMonthData(employee, month);
    });

    return row;
  });

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

        const scheduleRow = dataSchedules
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
    { key: "workedMonths", color: "var(--color-yl)", label: "Worked" },
  ];
  const toggleBar = (key: BarKey) => {
    setVisibleBars((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const CHART_DATA_BY_FILTERS = {
    employees: chartDataByEmployee,
    month: chartDataByMonth,
  };

  const chartData =
    CHART_DATA_BY_FILTERS[filters as keyof typeof CHART_DATA_BY_FILTERS] || [];

  const subHeadersByFilter = SUB_HEADERS.filter(
    (key) => !activeKeyMonthData[key as keyof MonthData],
  );

  return (
    <>
      <div className="flex items-center justify-center gap-2 md:gap-6 md:p-1 print:hidden">
        <NavTabs
          navItems={NAV_TABS}
          activeTab={filters}
          handleTabChange={(value) =>
            setFilters(value as "employees" | "month" | "table")
          }
          withSelect
        />

        <MonthPicker value={range} onChange={setRange} />

        <button
          disabled={!range}
          type="button"
          onClick={() => setRange(undefined)}
          className="w-2 md:w-4"
        >
          {range && <TrashIcon className="text-rd h-4 w-4" />}
        </button>
      </div>

      {filters === "table" ? (
        <Table className="my-2">
          <TableHeader>
            <TableRow className="[&>th]:h-5! [&>th]:p-0!">
              <TableHead className="bg-background sticky left-0 z-10" />
              <TableHead />

              {monthsToDisplay.map((month) => {
                return (
                  <TableHead
                    key={month}
                    colSpan={subHeadersByFilter.length}
                    className={cn("border-l p-0 text-center text-xs")}
                  >
                    {month.slice(0, 3)}
                  </TableHead>
                );
              })}
            </TableRow>
            <TableRow className="[&>th]:h-6! [&>th]:p-0!">
              <TableHead className="bg-background sticky left-0 z-10" />
              <TableHead />
              {monthsToDisplay.map((month) => {
                const hasData = dataSchedulesPrevMonth?.some(
                  (m) => m.month.toLowerCase() === month.toLowerCase(),
                );
                if (!hasData) return;
                return subHeadersByFilter.map((subHeader) => (
                  <TableHead
                    key={`${month}-${subHeader}`}
                    className={cn(
                      "p-0 text-center text-xs",
                      !hasData && "bg-muted/50",
                    )}
                  >
                    {subHeader}
                  </TableHead>
                ));
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row, idx) => {
              const workedMonths =
                chartDataByEmployee.find(
                  (emp) => emp.name.trim() === row.employee.trim(),
                )?.workedMonths || 0;
              return (
                <TableRow
                  key={idx}
                  className={cn(
                    "[&>td]:py-1.5 [&>td]:text-xs print:[&>td]:py-3",
                    idx % 2 === 0 && "bg-gray-100",
                    tableData.length < 16 && "[&>td]:py-3",
                  )}
                >
                  <TableCell className="sticky left-0 z-10 print:text-sm!">
                    {row.employee}
                  </TableCell>
                  <TableCell>{workedMonths || ""}</TableCell>
                  {monthsToDisplay.map((month, monthIdx) => {
                    const monthData = row[month] as MonthData | undefined;
                    const hasData = dataSchedulesPrevMonth?.some(
                      (m) => m.month.toLowerCase() === month.toLowerCase(),
                    );
                    const isLastMonth = monthIdx === MONTHS.length - 1;

                    return subHeadersByFilter.map((subHeader, subIdx) => {
                      const isLastSubHeader =
                        subIdx === subHeadersByFilter.length - 1;

                      return (
                        <TableCell
                          key={`${row.employee}-${month}-${subHeader}`}
                          className={cn(
                            "border-l px-1 text-center text-xs",
                            !hasData && "bg-muted/30",
                            monthData?.t === 0 && "border-l-0!",
                            isLastSubHeader &&
                              !isLastMonth &&
                              "border-r-2 border-r-slate-400",
                            (subHeader === "t" || subHeader === "r") &&
                              "font-semibold",
                          )}
                        >
                          {monthData && monthData[subHeader as keyof MonthData]
                            ? (
                                monthData[subHeader as keyof MonthData] ?? 0
                              ).toFixed(0)
                            : !hasData
                              ? ""
                              : ""}
                        </TableCell>
                      );
                    });
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <>
          <CustomChart
            chartData={chartData.filter((data) => data.total > 0)}
            barItem={BAR_KEYS.filter(({ key }) => visibleBars[key as BarKey])}
            className={cn(
              filters === "employees" ? "h-[66dvh] md:h-[77dvh]" : "h-[66dvh]",
            )}
            vertical={chartData.length > 20}
          />
          <CustomLegend
            items={BAR_KEYS}
            visibleItems={visibleBars}
            onToggle={toggleBar}
          />
        </>
      )}
      <div>
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
        <div className="flex flex-wrap justify-center gap-1 md:px-4">
          {filters === "table" &&
            SUB_HEADERS.map((key) => (
              <span
                key={key}
                onClick={() =>
                  setActiveKeyMonthData((prev) => ({
                    ...prev,
                    [key]: !prev[key],
                  }))
                }
                className={cn(
                  "text-rd cursor-pointer rounded-full px-2 py-1 text-xs font-bold transition-opacity md:px-6",
                  activeKeyMonthData[key] && activeName !== key && "opacity-35",
                  activeKeyMonthData[key] && "print:hidden",
                )}
              >
                {key}
              </span>
            ))}
        </div>
      </div>
    </>
  );
}
