"use client";
import { SchedulesContextValue } from "@/app/actions/schedule/schedule-action";
import { useSearchParams } from "next/navigation";

import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import { type ChartConfig } from "@/components/ui/chart";
import { useState } from "react";

type ChartDataItem = {
  name: string;
  day: number;
  night: number;
};

type BarKey = keyof Omit<ChartDataItem, "name">;
type BarItem = {
  key: BarKey;
  color: string;
  label: string;
};

export default function ChartSchedulePage({
  schedules,
}: {
  schedules: SchedulesContextValue[] | null;
}) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const schedule = schedules?.find((s: any) => s.role === tab) ?? null;

  const BAR_KEYS: BarItem[] = [
    { key: "day", color: "var(--color-bl)", label: "Day" },
    { key: "night", color: "var(--color-gr)", label: "Night" },
  ];
  const [visibleBars, setVisibleBars] = useState<Record<BarKey, boolean>>({
    day: true,
    night: true,
  });
  const chartData =
    schedule?.rowShifts.map((row) => ({
      name: row.employee.split(" ")[0] + " " + row.employee.split(" ")[1][0],
      day: Number(row.dayHours),
      night: Number(row.nightHours),
    })) ?? [];

  const chartConfig = {
    day: {
      label: "day",
      color: "var(--color-bl)",
    },
    night: {
      label: "night",
      color: "var(--color-gr)",
    },
  } satisfies ChartConfig;

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
