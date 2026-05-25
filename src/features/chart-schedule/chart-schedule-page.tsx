"use client";
import { GetScheduleData } from "@/app/actions/schedule/schedule-action";
import { useSearchParams } from "next/navigation";

import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import { useState } from "react";

type ChartDataItem = {
  name: string;
  day: number;
  night: number;
  total: number;
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
  schedules: GetScheduleData[] | null;
}) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const schedule = schedules?.find((s) => s.id === tab) ?? null;

  const BAR_KEYS: BarItem[] = [
    { key: "day", color: "var(--color-bl)", label: "Day" },
    { key: "night", color: "var(--color-gr)", label: "Night" },
    { key: "total", color: "var(--color-gn)", label: "Total" },
  ];
  const [visibleBars, setVisibleBars] = useState<Record<BarKey, boolean>>({
    day: true,
    night: true,
    total: true,
  });
  const chartData =
    schedule?.rowShifts.map((row) => ({
      name: row.employee.split(" ")[0] + " " + row.employee.split(" ")[1][0],
      day: Number(row.dayHours),
      night: Number(row.nightHours),
      total: Number(row.totalHours),
    })) ?? [];

  const toggleBar = (key: BarKey) => {
    setVisibleBars((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <CustomChart
        chartData={chartData}
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
