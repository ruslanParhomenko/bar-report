"use client";
import { GetScheduleData } from "@/app/actions/schedule/schedule-action";
import { useSearchParams } from "next/navigation";

import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { MONTHS } from "@/utils/get-month-days";
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
  schedules: { month: string; data: GetScheduleData[] }[] | null;
}) {
  const [filters, setFilters] = useState<"month" | "year">("month");
  const [activeName, setActiveName] = useState<string>("");

  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const month = searchParams.get("month");

  if (!tab || !month) return null;

  const schedule =
    schedules
      ?.find((s) => s.month === month)
      ?.data?.find((s) => s.id === tab) ?? null;

  const BAR_KEYS: BarItem[] = [
    { key: "day", color: "var(--color-bl)", label: "Day" },
    { key: "night", color: "var(--color-gr)", label: "Night" },
    { key: "total", color: "var(--color-gn)", label: "Total" },
  ];
  const [visibleBars, setVisibleBars] = useState<Record<BarKey, boolean>>({
    day: false,
    night: false,
    total: true,
  });

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

  const chartDataYear: ChartDataItem[] = scheduleDataByRole
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

  const toggleBar = (key: BarKey) => {
    setVisibleBars((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const chartData = filters === "month" ? chartDataMonth : chartDataYear;

  return (
    <>
      <div className="flex items-center justify-center gap-4 md:px-6 print:hidden">
        <Label
          className={cn(
            "text-xs",
            filters === "month" ? "text-rd" : "text-muted-foreground",
          )}
        >
          month
        </Label>
        <Switch
          id="chart-filter"
          checked={filters === "year"}
          onCheckedChange={(checked) => setFilters(checked ? "year" : "month")}
          className="shadow-none"
        />
        <Label
          className={cn(
            "text-xs",
            filters === "year" ? "text-rd" : "text-muted-foreground",
          )}
        >
          year
        </Label>
      </div>

      <CustomChart
        chartData={chartData}
        barItem={BAR_KEYS.filter(({ key }) => visibleBars[key as BarKey])}
        className={cn(filters === "year" ? "h-[70dvh]" : "h-[75dvh]")}
      />
      <CustomLegend
        items={BAR_KEYS}
        visibleItems={visibleBars}
        onToggle={toggleBar}
      />
      <div className="flex flex-wrap justify-center gap-1 md:px-4 md:pb-2">
        {filters === "year" &&
          uniqueNames.map((name) => (
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
