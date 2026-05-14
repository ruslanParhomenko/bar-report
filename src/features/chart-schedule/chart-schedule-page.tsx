"use client";
import { SchedulesContextValue } from "@/app/actions/schedule/schedule-action";
import CustomTooltip from "@/components/charts/custom-tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
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

  const isMobile = useIsMobile();

  const schedule = schedules?.find((s: any) => s.role === tab) ?? null;

  const chartData = schedule?.rowShifts.map((row) => ({
    name: row.employee.split(" ")[0] + " " + row.employee.split(" ")[1][0],
    day: Number(row.dayHours),
    night: Number(row.nightHours),
  }));

  const height = isMobile ? 600 : 700;

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          График отработанных часов
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          style={{
            transition: "opacity 0.3s ease",
          }}
        >
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: -1, left: -10, bottom: 10 }}
              barCategoryGap={isMobile ? "10%" : "20%"}
            >
              <CartesianGrid stroke="var(--border)" />
              <YAxis
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
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
              <Tooltip
                content={<CustomTooltip />}
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
