"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
  chartConfig: ChartConfig;
  barItem: BarItem[];
  className?: string;
  withLegend?: boolean;
};

export default function CustomChart({
  chartData,
  chartConfig,
  barItem,
  className,
  withLegend = false,
}: CustomChartProps) {
  const isMobile = useIsMobile();

  const height = isMobile ? "h-[80dvh]" : "h-[86dvh]";

  if (isMobile) {
    return (
      <ChartContainer
        config={chartConfig}
        className={cn("mt-2 w-[90dvw] md:mt-6", height, className)}
      >
        <BarChart accessibilityLayer data={chartData} layout="vertical">
          <CartesianGrid horizontal={false} />
          <XAxis type="number" tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            tickLine={false}
            axisLine={false}
            width={80}
            tickFormatter={(value: string) => value?.split(" ")[0]}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          {withLegend && (
            <ChartLegend content={<ChartLegendContent payload={undefined} />} />
          )}
          {barItem.map(({ key, color }) => (
            <Bar key={key} dataKey={key} fill={color} radius={6} />
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
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value: string) => value?.split(" ")[0]}
        />
        <YAxis axisLine={false} tickLine={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        {withLegend && (
          <ChartLegend content={<ChartLegendContent payload={undefined} />} />
        )}
        {barItem.map(({ key, color }) => (
          <Bar key={key} dataKey={key} fill={color} radius={6} />
        ))}
      </BarChart>
    </ChartContainer>
  );
}
