"use client";
import { YearData } from "@/app/actions/remarks/remarks-action";
import NavTabs from "@/components/nav-tabs/nav-tabs";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { useMonthDays } from "@/providers/month-days-provider";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { getChartDataFromMonth, getChartDataFromYear } from "./utils";

const navItems = ["month", "year"];

export type ChartDataItem = {
  name: string;
  reason: number;
  bonus: number;
  penalty: number;
  hours: number;
};

type BarKey = keyof Omit<ChartDataItem, "name">;

const BAR_KEYS: { key: BarKey; color: string; label: string }[] = [
  { key: "reason", color: "var(--color-gr)", label: "Reason" },
  { key: "penalty", color: "var(--color-rd)", label: "Penalty" },
  { key: "bonus", color: "var(--color-bl)", label: "Bonus" },
  { key: "hours", color: "var(--color-gn)", label: "Hours" },
];

export default function ChartRemarksPage({
  dataRemarks,
}: {
  dataRemarks: YearData[];
}) {
  const { month } = useMonthDays();
  const [interval, setInterval] = useState("month");

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
  const chartData = interval === "month" ? chartDataMonth : chartDataYear;

  const chartConfig = {
    reason: { label: "Reason", color: "var(--color-gr)" },
    penalty: { label: "Penalty", color: "var(--color-rd)" },
    bonus: { label: "Bonus", color: "var(--color-bl)" },
    hours: { label: "Hours", color: "var(--color-gn)" },
  } satisfies ChartConfig;

  const CustomLegend = () => (
    <div className="mt-4 flex justify-center gap-4">
      {BAR_KEYS.map(({ key, color, label }) => (
        <button
          key={key}
          onClick={() => toggleBar(key)}
          className={cn(
            "flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-opacity",
            !visibleBars[key] && "opacity-35",
          )}
        >
          <span
            className="inline-block h-3 w-3 rounded-sm"
            style={{ backgroundColor: color }}
          />
          {label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col">
      <div className="m-auto w-100">
        <NavTabs
          navItems={navItems}
          activeTab={interval}
          handleTabChange={(value) => setInterval(value)}
        />
      </div>
      <ChartContainer
        config={chartConfig}
        className={cn("mt-6 h-[75dvh] w-full")}
      >
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.split(" ")[0]}
          />
          <YAxis axisLine={false} tickLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />

          {BAR_KEYS.map(({ key, color }) =>
            visibleBars[key] ? (
              <Bar key={key} dataKey={key} fill={color} radius={6} />
            ) : null,
          )}
        </BarChart>
      </ChartContainer>

      <CustomLegend />
    </div>
  );
}
