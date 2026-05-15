"use client";
import { GetTipsData } from "@/app/actions/tips/tips-action";
import CustomChart from "@/components/chart/custom-chart";
import { ChartConfig } from "@/components/ui/chart";
import { useMonthDays } from "@/providers/month-days-provider";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

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

  const chartDataMonth =
    dataTipsMonth?.tipsData.rowEmployeesTips.map((row) => ({
      name: row.employee.split(" ")[0] + " " + row.employee.split(" ")[1][0],
      tips: row.tipsByDay.reduce((sum, t) => sum + Number(t), 0),
    })) ?? [];

  const chartData = tab === "year" ? chartDataYear : chartDataMonth;
  const chartConfig = {
    tips: {
      label: "tips",
      color: "var(--color-bl)",
    },
  } satisfies ChartConfig;

  const BAR_KEYS = [{ key: "tips", color: "var(--color-bl)", label: "Tips" }];

  return (
    <CustomChart
      chartData={chartData}
      chartConfig={chartConfig}
      barItem={BAR_KEYS}
      className="mt-6 h-[86dvh] w-[90dvw]"
    />
  );
}
