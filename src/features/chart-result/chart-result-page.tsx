"use client";
import { GetScheduleData } from "@/app/actions/schedule/schedule-action";
import { GetTipsData } from "@/app/actions/tips/tips-action";
import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { extractUniqueEmployees, useResultCalculations } from "../result/utils";

const ROLE = {
  barmen: "bar",
  waiters: "bar",
  dish: "dish",
  cucina: "cucina",
};
type ChartDataItem = {
  name: string;
  salary: number;
  tips: number;
  total: number;
  hours: number;
  rate: number;
};

type BarKey = keyof Omit<ChartDataItem, "name">;
type BarItem = {
  key: BarKey;
  color: string;
  label: string;
};

export default function ChartResultPage({
  dataSchedules,
  tipsDataYear,
  month,
  year,
}: {
  dataSchedules: { month: string; data: GetScheduleData[] }[] | null;
  tipsDataYear: GetTipsData[] | null;
  month: string;
  year: string;
}) {
  const role = useSearchParams().get("tab") || "barmen";

  const [filters, setFilters] = useState<"month" | "year">("month");

  const selectedSchedule =
    dataSchedules
      ?.find((item) => item.month === month)
      ?.data?.filter(
        (item: any) => item.id === ROLE[role as keyof typeof ROLE],
      ) || [];
  const tipsData =
    tipsDataYear?.find((item) => item.id === month)?.tipsData || null;
  const rowEmployees = tipsData?.rowEmployeesTips || [];
  const employees = extractUniqueEmployees(selectedSchedule, [], rowEmployees);

  const { rows } = useResultCalculations({
    data: employees,
    dataTipsBid: tipsData!,
    month,
    year,
    role,
  });

  const [visibleBars, setVisibleBars] = useState<Record<BarKey, boolean>>({
    salary: true,
    tips: true,
    total: true,
    hours: true,
    rate: true,
  });
  const chartDataMonth: ChartDataItem[] = rows.map((row) => ({
    name: row.e.employee,
    salary: +row.salary,
    tips: row.sendTips,
    total: row.result,
    hours: row.totalHours,
    rate: row.rate,
  }));

  const calcRows = useResultCalculations;
  const yearTotalsMap: Record<string, ChartDataItem> = {};

  for (const monthItem of dataSchedules || []) {
    const schedule =
      monthItem.data?.filter(
        (item: any) => item.id === ROLE[role as keyof typeof ROLE],
      ) || [];

    const monthTipsData =
      tipsDataYear?.find((item) => item.id === monthItem.month)?.tipsData ||
      null;
    const monthRowEmployees = monthTipsData?.rowEmployeesTips || [];

    const emp = extractUniqueEmployees(schedule, [], monthRowEmployees);

    const { rows: monthRows } = calcRows({
      data: emp,
      dataTipsBid: monthTipsData!,
      month: monthItem.month,
      year,
      role,
    });

    for (const row of monthRows) {
      const name = row.e.employee;
      if (!yearTotalsMap[name]) {
        yearTotalsMap[name] = {
          name,
          salary: 0,
          tips: 0,
          total: 0,
          hours: 0,
          rate: row.rate,
        };
      }
      yearTotalsMap[name].salary += +row.salary;
      yearTotalsMap[name].tips += row.sendTips;
      yearTotalsMap[name].total += row.result;
      yearTotalsMap[name].hours += row.totalHours;
    }
  }

  const chartDataYear: ChartDataItem[] = Object.values(yearTotalsMap).sort(
    (a, b) => a.name.localeCompare(b.name),
  );

  const BAR_KEYS: BarItem[] = [
    { key: "salary", color: "var(--color-gn)", label: "Salary" },
    { key: "tips", color: "var(--color-rd)", label: "Tips" },
    { key: "total", color: "var(--color-bl)", label: "Total" },
    { key: "hours", color: "var(--color-primary)", label: "Hours" },
    { key: "rate", color: "var(--color-yl)", label: "Rate" },
  ];
  const toggleBar = (key: BarKey) => {
    setVisibleBars((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const chartData = filters === "month" ? chartDataMonth : chartDataYear;
  return (
    <>
      <div className="flex items-center justify-start gap-4 px-4">
        <Switch
          id="chart-filter"
          checked={filters === "year"}
          onCheckedChange={(checked) => setFilters(checked ? "year" : "month")}
          className="shadow-none"
        />
        <Label className="text-muted-foreground text-xs">{filters}</Label>
      </div>
      <CustomChart
        chartData={chartData}
        barItem={BAR_KEYS.filter(({ key }) => visibleBars[key as BarKey])}
        className="h-[80dvh]"
      />
      <CustomLegend
        items={BAR_KEYS}
        visibleItems={visibleBars}
        onToggle={toggleBar}
      />
    </>
  );
}
