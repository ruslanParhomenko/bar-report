"use client";
import { SchedulesContextValue } from "@/app/actions/schedule/schedule-action";
import { GetTipsData } from "@/app/actions/tips/tips-action";
import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import { ChartConfig } from "@/components/ui/chart";
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
  dataSchedule,
  tipsData,
  month,
  year,
}: {
  dataSchedule: SchedulesContextValue[];
  tipsData: GetTipsData | null;
  month: string;
  year: string;
}) {
  const role = useSearchParams().get("tab") || "barmen";

  const selectedSchedule = dataSchedule.filter(
    (item: any) => item.role === ROLE[role as keyof typeof ROLE],
  );

  const rowEmployees = tipsData?.tipsData?.rowEmployeesTips || [];
  const employees = extractUniqueEmployees(selectedSchedule, [], rowEmployees);

  const { rows } = useResultCalculations({
    data: employees,
    dataTipsBid: tipsData?.tipsData!,
    month,
    year,
    role,
  });

  console.log(rows);

  const [visibleBars, setVisibleBars] = useState<Record<BarKey, boolean>>({
    salary: true,
    tips: true,
    total: true,
    hours: true,
    rate: true,
  });
  const chartData: ChartDataItem[] = rows.map((row) => ({
    name: row.e.employee,
    salary: +row.salary,
    tips: row.sendTips,
    total: row.result,
    hours: row.totalHours,
    rate: row.rate,
  }));

  const chartConfig = {
    salary: {
      label: "salary",
      color: "var(--color-gn)",
    },
    tips: {
      label: "tips",
      color: "var(--color-rd)",
    },
    total: {
      label: "total",
      color: "var(--color-bl)",
    },
    hours: {
      label: "hours",
      color: "var(--color-primary)",
    },
    rate: {
      label: "rate",
      color: "var(--color-yl)",
    },
  } satisfies ChartConfig;

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
  return (
    <>
      <CustomChart
        chartData={chartData}
        chartConfig={chartConfig}
        barItem={BAR_KEYS.filter(({ key }) => visibleBars[key as BarKey])}
      />
      <CustomLegend
        items={BAR_KEYS}
        visibleItems={visibleBars}
        onToggle={toggleBar}
      />
    </>
  );
}
