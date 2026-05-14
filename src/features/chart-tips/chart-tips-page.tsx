"use client";
import { GetTipsData } from "@/app/actions/tips/tips-action";
import CustomTooltip from "@/components/charts/custom-tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMonthDays } from "@/providers/month-days-provider";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function ChartTipsPage({
  dataTipsYear,
}: {
  dataTipsYear: GetTipsData[] | null;
}) {
  const tab = useSearchParams().get("tab");

  const { month } = useMonthDays();
  const isMobile = useIsMobile();

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

  const chartData = dataTipsMonth?.tipsData.rowEmployeesTips.map((row) => ({
    name: row.employee.split(" ")[0] + " " + row.employee.split(" ")[1][0],
    tips: row.tipsByDay.reduce((sum, t) => sum + Number(t), 0),
  }));

  const height = isMobile ? 600 : 700;

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-sm font-medium">График чаевых</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={tab === "year" ? chartDataYear : chartData}
            margin={{ top: 10, right: -1, left: -10, bottom: 10 }}
            barCategoryGap={isMobile ? "10%" : "20%"}
          >
            <CartesianGrid stroke="var(--border)" />
            <XAxis
              dataKey="name"
              tick={{
                fill: "var(--muted-foreground)",
                fontSize: isMobile ? 10 : 12,
              }}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={isMobile ? -90 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 80 : 30}
            />
            <YAxis
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<CustomTooltip unit="mdl" />}
              cursor={{ fill: "var(--sidebar)" }}
            />
            <Bar
              dataKey="tips"
              stackId="a"
              fill="var(--color-bl)"
              name="tips"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
