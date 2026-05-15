"use client";
import { GetTipsData } from "@/app/actions/tips/tips-action";
import CustomTooltip from "@/components/charts/custom-tooltip";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { useMonthDays } from "@/providers/month-days-provider";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

export default function ChartTipsPage({
  dataTipsYear,
}: {
  dataTipsYear: GetTipsData[] | null;
}) {
  const tab = useSearchParams().get("tab");

  const { month } = useMonthDays();

  const dataTipsMonth = dataTipsYear?.find((data) => data.id === month) || null;

  const chartDataYear = useMemo(() => {
    const totals = new Map<string, number>();

    (dataTipsYear ?? []).forEach((monthData) => {
      monthData.tipsData.rowEmployeesTips.forEach((row) => {
        const name = row.employee.trim();
        const tips = row.tipsByDay.reduce((sum, t) => sum + Number(t || 0), 0);
        totals.set(name, (totals.get(name) ?? 0) + tips);
      });
    });

    return Array.from(totals.entries())
      .map(([name, tips]) => ({
        name: name.split(" ")[0],
        tips,
      }))
      .filter((row) => row.tips > 0)
      .sort((a, b) => b.tips - a.tips);
  }, [dataTipsYear]);

  const chartDataMonth = dataTipsMonth?.tipsData.rowEmployeesTips.map(
    (row) => ({
      name: row.employee.split(" ")[0] + " " + row.employee.split(" ")[1][0],
      tips: row.tipsByDay.reduce((sum, t) => sum + Number(t), 0),
    }),
  );

  const chartData = tab === "year" ? chartDataYear : chartDataMonth;
  const chartConfig = {
    tips: {
      label: "tips",
      color: "var(--color-bl)",
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
          interval={0}
          tickFormatter={(value) => value.split(" ")[0]}
        />
        <YAxis axisLine={false} tickLine={false} />
        <Tooltip
          content={<CustomTooltip unit="mdl" />}
          cursor={{ fill: "var(--sidebar)" }}
        />
        <Bar dataKey="tips" fill="var(--color-tips)" radius={6} />
      </BarChart>
    </ChartContainer>
  );
}
