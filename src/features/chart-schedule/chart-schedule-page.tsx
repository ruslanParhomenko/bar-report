"use client";
import { SchedulesContextValue } from "@/app/actions/schedule/schedule-action";
import CustomTooltip from "@/components/charts/custom-tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">График часов</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          style={{
            transition: "opacity 0.3s ease",
          }}
        >
          <ResponsiveContainer width="100%" height={700}>
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
                dataKey="day"
                stackId="a"
                fill="var(--color-bl)"
                name="Дневные"
              />
              <Bar
                dataKey="night"
                stackId="a"
                fill="var(--color-gr)"
                name="Ночные"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
