"use client";
import { GetScheduleData } from "@/app/actions/schedule/schedule-action";
import { useSearchParams } from "next/navigation";

import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import NameFilter from "@/components/chart/name-filter";
import { BarConfig } from "@/components/chart/types";
import NavTabs from "@/components/nav-tabs/nav-tabs";
import { MONTHS } from "@/utils/get-month-days";
import { toggleBarVisibility } from "@/utils/toggle-bar-visibility";
import { useState } from "react";

const ITEM_KEYS = ["day", "night", "total"] as const;
type BarKey = BarConfig<(typeof ITEM_KEYS)[number]>;

const BAR_KEYS: BarKey[] = [
  { key: "day", color: "var(--color-bl)", visible: false },
  { key: "night", color: "var(--color-gr)", visible: false },
  { key: "total", color: "var(--color-gn)", visible: true },
];

export default function ChartSchedulePage({
  schedules,
}: {
  schedules: { month: string; data: GetScheduleData[] }[] | null;
}) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const month = searchParams.get("month");

  const [filters, setFilters] = useState<"month" | "year">("month");
  const [activeName, setActiveName] = useState<string>("");
  const [barKeys, setBarKeys] = useState(BAR_KEYS);

  if (!tab || !month) return null;

  const schedule =
    schedules
      ?.find((s) => s.month === month)
      ?.data?.find((s) => s.id === tab) ?? null;

  const scheduleDataByRole = schedules || [];

  const uniqueNames = [
    ...new Set(
      schedules?.flatMap(
        (s) =>
          s.data?.find((d) => d.id === tab)?.rowShifts.map((r) => r.employee) ??
          [],
      ),
    ),
  ];

  const chartDataYear = scheduleDataByRole
    .sort((a, b) => MONTHS.indexOf(a.month) - MONTHS.indexOf(b.month))
    .map((schedule) => {
      const rows =
        schedule.data
          .find((d) => d.id === tab)
          ?.rowShifts.filter((r) => !activeName || r.employee === activeName) ??
        [];

      const sum = (key: "dayHours" | "nightHours" | "totalHours") =>
        rows.reduce((acc, r) => acc + Number(r[key]), 0);

      return {
        name: schedule.month,
        day: sum("dayHours"),
        night: sum("nightHours"),
        total: sum("totalHours"),
      };
    });

  const chartDataMonth =
    schedule?.rowShifts.map((row) => ({
      name: row.employee.split(" ")[0] + " " + row.employee.split(" ")[1]?.[0],
      day: Number(row.dayHours),
      night: Number(row.nightHours),
      total: Number(row.totalHours),
    })) ?? [];

  const toggleBar = (key: BarKey["key"]) =>
    setBarKeys((prev) => toggleBarVisibility(prev, key));

  const CHART_BY_FILTER = {
    month: chartDataMonth,
    year: chartDataYear,
  };

  const chartData = CHART_BY_FILTER[filters];

  return (
    <div className="flex flex-col items-center justify-between">
      <NavTabs
        navItems={["month", "year"]}
        activeTab={filters}
        handleTabChange={(value) => setFilters(value)}
        withSelect
      />

      <CustomChart
        chartData={chartData}
        barItem={barKeys.filter(({ visible }) => visible)}
        className="h-[70dvh]"
      />
      <CustomLegend items={barKeys} onToggle={toggleBar} />
      <NameFilter
        names={uniqueNames}
        activeName={activeName}
        onChange={setActiveName}
        isVisible={filters === "year"}
      />
    </div>
  );
}
