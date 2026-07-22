"use client";

import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { BAR_KEYS } from "./constants";
import type { BarKey, ChartDataItem, ChartResultFilter } from "./types";

export function ChartResultChart({
  chartData,
  filters,
  uniqueEmployees,
  activeName,
  onSelectName,
}: {
  chartData: ChartDataItem[];
  filters: ChartResultFilter;
  uniqueEmployees: string[];
  activeName: string;
  onSelectName: (name: string) => void;
}) {
  const [visibleBars, setVisibleBars] = useState<Record<BarKey, boolean>>({
    salary: false,
    tips: false,
    total: true,
    hours: false,
    rate: false,
    workedMonths: false,
  });

  const toggleBar = (key: BarKey) => {
    setVisibleBars((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <CustomChart
        chartData={chartData.filter((data) => data.total > 0)}
        barItem={BAR_KEYS.filter(({ key }) => visibleBars[key])}
        className={cn(
          filters === "employees" ? "h-[66dvh] md:h-[77dvh]" : "h-[66dvh]",
        )}
        vertical={chartData.length > 20}
      />
      <CustomLegend
        items={BAR_KEYS}
        visibleItems={visibleBars}
        onToggle={toggleBar}
      />

      {filters === "month" && (
        <div className="flex flex-wrap justify-center gap-1 md:px-4 md:pb-2">
          {uniqueEmployees.map((name) => (
            <span
              key={name}
              onClick={() => onSelectName(activeName === name ? "" : name)}
              className={cn(
                "cursor-pointer rounded-full px-1 py-1 text-xs transition-opacity md:px-3",
                activeName && activeName !== name && "opacity-35",
                activeName !== name && "print:hidden",
              )}
            >
              {name}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
