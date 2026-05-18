"use client";
import { GetAoData } from "@/app/actions/a-o/ao-action";
import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import { ChartConfig } from "@/components/ui/chart";
import { useMonthDays } from "@/providers/month-days-provider";
import { MONTHS } from "@/utils/get-month-days";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

type ChartDataItem = {
  name: string;
  value: number;
};

type BarKey = keyof Omit<ChartDataItem, "name">;

type BarItem = {
  key: BarKey;
  color: string;
  label: string;
};

export default function ChartAOPage({
  dataAOYear,
}: {
  dataAOYear: GetAoData[] | null;
}) {
  const { monthDays, month } = useMonthDays();
  const tab = useSearchParams().get("tab");

  const [visibleBars, setVisibleBars] = useState<Record<BarKey, boolean>>({
    value: true,
  });

  const dataAOMonth = dataAOYear?.find((data) => data.id === month);

  const chartDataDay = monthDays.map((day, index) => {
    let totalValue = 0;

    const rowAOData = dataAOMonth?.aoData?.rowAOData || {};
    Object.values(rowAOData).forEach((values) => {
      if (Array.isArray(values) && values[index] !== undefined) {
        totalValue += Number(values[index]) || 0;
      }
    });

    return {
      name: String(day.day),
      value: totalValue,
    };
  });

  const chartDataMonth = Object.entries(
    dataAOMonth?.aoData?.rowAOData || {},
  ).map(([name, values]) => ({
    name,
    value: (Array.isArray(values) ? values : []).reduce(
      (sum, v) => sum + (Number(v) || 0),
      0,
    ),
  }));

  const chartDataYear = MONTHS.map((monthName) => {
    const monthData = dataAOYear?.find((d) => d.id === monthName);

    let totalValue = 0;

    const rowAOData = monthData?.aoData?.rowAOData || {};
    Object.values(rowAOData).forEach((values) => {
      if (Array.isArray(values)) {
        totalValue += values.reduce((sum, v) => sum + (Number(v) || 0), 0);
      }
    });

    return {
      name: monthName,
      value: totalValue,
    };
  });

  const chartConfig = {
    value: {
      label: "value",
      color: "var(--color-bl)",
    },
  } satisfies ChartConfig;

  const BAR_KEYS: BarItem[] = [
    { key: "value", color: "var(--color-bl)", label: "Value" },
  ];

  const toggleBar = (key: BarKey) => {
    setVisibleBars((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const chartData =
    tab === "year"
      ? chartDataYear
      : tab === "month"
        ? chartDataMonth
        : chartDataDay;

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
