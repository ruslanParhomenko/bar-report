"use client";
import { YearData } from "@/app/actions/remarks/remarks-action";
import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import { ChartConfig } from "@/components/ui/chart";
import { useMonthDays } from "@/providers/month-days-provider";
import { useState } from "react";
import { getChartDataFromMonth, getChartDataFromYear } from "./utils";

export type ChartDataItem = {
  name: string;
  reason: number;
  bonus: number;
  penalty: number;
  hours: number;
};

type BarKey = keyof Omit<ChartDataItem, "name">;

type BarItem = {
  key: BarKey;
  color: string;
  label: string;
};

const BAR_KEYS: BarItem[] = [
  { key: "reason", color: "var(--color-gr)", label: "Reason" },
  { key: "penalty", color: "var(--color-rd)", label: "Penalty" },
  { key: "bonus", color: "var(--color-bl)", label: "Bonus" },
  { key: "hours", color: "var(--color-gn)", label: "Hours" },
];

export default function ChartRemarksPage({
  dataRemarks,
  tab,
}: {
  dataRemarks: YearData[];
  tab: string;
}) {
  const { month } = useMonthDays();

  const [visibleBars, setVisibleBars] = useState<Record<BarKey, boolean>>({
    reason: true,
    penalty: true,
    bonus: true,
    hours: true,
  });

  const toggleBar = (key: BarKey) => {
    setVisibleBars((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const dataRemarksMonth =
    dataRemarks.find((data) => data.id === month) || null;

  const chartDataMonth = dataRemarksMonth
    ? getChartDataFromMonth(dataRemarksMonth)
    : [];
  const chartDataYear = getChartDataFromYear(dataRemarks);
  const chartData = tab === "penalty-month" ? chartDataMonth : chartDataYear;

  const chartConfig = {
    reason: { label: "Reason", color: "var(--color-gr)" },
    penalty: { label: "Penalty", color: "var(--color-rd)" },
    bonus: { label: "Bonus", color: "var(--color-bl)" },
    hours: { label: "Hours", color: "var(--color-gn)" },
  } satisfies ChartConfig;

  return (
    <>
      <CustomChart
        chartData={chartData}
        chartConfig={chartConfig}
        barItem={BAR_KEYS.filter(({ key }) => visibleBars[key])}
      />
      <CustomLegend
        items={BAR_KEYS}
        visibleItems={visibleBars}
        onToggle={toggleBar}
      />
    </>
  );
}
