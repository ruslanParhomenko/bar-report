"use client";
import { GetTipsData } from "@/app/actions/tips/tips-action";
import CustomTooltip from "@/components/charts/custom-tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMonthDays } from "@/providers/month-days-provider";
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
  const { month } = useMonthDays();
  const dataTips = dataTipsYear?.find((data) => data.id === month) || null;

  const chartData = dataTips?.tipsData.rowEmployeesTips.map((row) => ({
    name: row.employee.split(" ")[0] + " " + row.employee.split(" ")[1][0],
    tips: row.tipsByDay.reduce((sum, t) => sum + Number(t), 0),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">График чаевых</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          style={{
            transition: "opacity 0.3s ease",
          }}
        >
          <ResponsiveContainer width="100%" height={600}>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 5, left: -20, bottom: 10 }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={
                  <CustomTooltip
                    active={false}
                    payload={[]}
                    accessibilityLayer={false}
                    coordinate={undefined}
                    activeIndex={undefined}
                  />
                }
                cursor={{ fill: "var(--sidebar)" }}
              />
              <Bar
                dataKey="tips"
                stackId="a"
                fill="var(--color-bl)"
                name="Дневные"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
