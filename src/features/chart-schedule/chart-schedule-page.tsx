"use client";
import { SchedulesContextValue } from "@/app/actions/schedule/schedule-action";
import { useSearchParams } from "next/navigation";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

export default function ChartSchedulePage({
  schedules,
}: {
  schedules: SchedulesContextValue[] | null;
}) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const schedule = schedules?.find((s: any) => s.role === tab) ?? null;

  const chartData = schedule?.rowShifts.map((row) => ({
    name: row.employee.split(" ")[0] + " " + row.employee.split(" ")[1][0],
    day: Number(row.dayHours),
    night: Number(row.nightHours),
  }));
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

  return (
    <ChartContainer
      config={chartConfig}
      className={cn("mt-6 h-[86dvh] w-full")}
    >
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />

        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.split(" ")[0]}
        />
        <YAxis axisLine={false} tickLine={false} />

        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent payload={undefined} />} />

        <Bar dataKey="day" fill="var(--color-day)" radius={6} />
        <Bar dataKey="night" fill="var(--color-night)" radius={6} />
      </BarChart>
    </ChartContainer>
  );
}
