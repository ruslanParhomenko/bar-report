"use client";

import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import NameFilter from "@/components/chart/name-filter";
import { BarConfig } from "@/components/chart/types";
import {
  ChartDataItem,
  ChartResultFilter,
} from "@/features/chart/chart-result/model/type";
import { toggleBarVisibility } from "@/utils/toggle-bar-visibility";
import { useState } from "react";

const ITEM_KEYS = [
  "salary",
  "tips",
  "total",
  "hours",
  "rate",
  "penalty",
  "bonus",
  "workedMonths",
] as const;
type BarKey = BarConfig<(typeof ITEM_KEYS)[number]>;

const BAR_KEYS: BarKey[] = [
  { key: "salary", color: "var(--color-gn)", visible: true },
  { key: "tips", color: "var(--color-rd)", visible: false },
  { key: "total", color: "var(--color-bl)", visible: false },
  { key: "hours", color: "var(--color-primary)", visible: false },
  { key: "rate", color: "var(--color-yl)", visible: false },
  { key: "penalty", color: "var(--color-gr)", visible: false },
  { key: "bonus", color: "var(--color-bl)", visible: false },
  { key: "workedMonths", color: "var(--color-yl)", visible: false },
];

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
  const [barKeys, setBarKeys] = useState(BAR_KEYS);

  const toggleBar = (key: BarKey["key"]) =>
    setBarKeys((prev) => toggleBarVisibility(prev, key));

  return (
    <>
      <CustomChart
        chartData={chartData.filter((data) => data.total > 0)}
        barItem={barKeys.filter(({ visible }) => visible)}
        className={filters === "month" ? "h-[72dvh]" : ""}
        vertical={chartData.length > 20}
      />
      <CustomLegend items={barKeys} onToggle={toggleBar} />

      <NameFilter
        names={uniqueEmployees}
        activeName={activeName}
        onChange={onSelectName}
        isVisible={filters === "month"}
      />
    </>
  );
}
