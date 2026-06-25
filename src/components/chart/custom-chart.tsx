"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

type ChartDataItem = {
  name: string;
  [key: string]: string | number;
};

type BarItem = {
  key: string;
  color: string;
  label: string;
};

type CustomChartProps = {
  chartData: ChartDataItem[];
  barItem: BarItem[];
  className?: string;
  withLegend?: boolean;
  withLabelLIst?: boolean;
  vertical?: boolean;
  disableTooltip?: boolean;
  disableYAxis?: boolean;
};

export default function CustomChart({
  chartData,
  barItem,
  className,
  withLegend = false,
  withLabelLIst = true,
  vertical = false,
  disableTooltip = false,
  disableYAxis = false,
}: CustomChartProps) {
  const isMobile = useIsMobile();

  const height = isMobile ? "h-[78dvh]" : "h-[82dvh]";

  const chartConfig = Object.fromEntries(
    barItem.map(({ key, label, color }) => [
      key,
      {
        label,
        color,
      },
    ]),
  ) as ChartConfig;

  if (isMobile) {
    return (
      <ChartContainer
        config={chartConfig}
        className={cn("mt-2 w-[90dvw] md:mt-6", height, className)}
      >
        <BarChart accessibilityLayer data={chartData} layout="vertical">
          <CartesianGrid horizontal={false} />

          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tick={!disableYAxis}
          />

          <YAxis
            type="category"
            dataKey="name"
            tickLine={false}
            axisLine={false}
            width={80}
            tickFormatter={(value: string) => value?.split(" ")[0]}
          />
          {!disableTooltip && (
            <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
          )}
          {withLegend && (
            <ChartLegend content={<ChartLegendContent payload={undefined} />} />
          )}
          {barItem.map(({ key, color }) => (
            <Bar key={key} dataKey={key} fill={color} radius={6}>
              {withLabelLIst && (
                <LabelList
                  dataKey={key}
                  values={key}
                  position="top"
                  fill="white"
                />
              )}
            </Bar>
          ))}
        </BarChart>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer
      config={chartConfig}
      className={cn("mt-2 w-[90dvw] md:mt-6", height, className)}
    >
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={6}
          axisLine={false}
          interval={0}
          angle={vertical ? -90 : 0}
          textAnchor={vertical ? "end" : "middle"}
          height={vertical ? 90 : 30}
          tick={{ fontSize: vertical ? 11 : 12 }}
          tickFormatter={(value: string) =>
            value.length > 14 ? value.slice(0, 12) + "…" : value.split(" ")[0]
          }
        />
        <YAxis axisLine={false} tickLine={false} tick={!disableYAxis} />

        {!disableTooltip && (
          <ChartTooltip
            cursor={{ fill: "var(--color-bg)" }}
            content={<ChartTooltipContent />}
          />
        )}
        {withLegend && (
          <ChartLegend content={<ChartLegendContent payload={undefined} />} />
        )}
        {barItem.map(({ key, color }) => (
          <Bar key={key} dataKey={key} fill={color} radius={6}>
            {withLabelLIst && (
              <LabelList dataKey={key} values={key} position="top" fill="red" />
            )}
          </Bar>
        ))}
      </BarChart>
    </ChartContainer>
  );
}
