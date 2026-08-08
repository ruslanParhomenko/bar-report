"use client";
import { GetAoData } from "@/app/actions/a-o/ao-action";
import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import { BarConfig } from "@/components/chart/types";
import { toggleBarVisibility } from "@/utils/toggle-bar-visibility";
import { useState } from "react";
import { getAoChartData } from "./utils";

const ITEM_KEYS = ["nori", "bar", "nbm", "zn", "moda"] as const;
type BarKey = BarConfig<(typeof ITEM_KEYS)[number]>;

const BAR_KEYS: BarKey[] = [
  { key: "nori", color: "var(--color-yl)", visible: false },
  { key: "bar", color: "var(--color-gr)", visible: false },
  { key: "nbm", color: "var(--color-rd)", visible: false },
  { key: "zn", color: "var(--color-gn)", visible: false },
  { key: "moda", color: "var(--color-bl)", visible: true },
];

export default function ChartAOPage({
  dataAOYear,
}: {
  dataAOYear: GetAoData[] | null;
}) {
  const [barKeys, setBarKeys] = useState(BAR_KEYS);

  const chartDataYear = getAoChartData(dataAOYear);

  const toggleBar = (key: BarKey["key"]) =>
    setBarKeys((prev) => toggleBarVisibility(prev, key));

  const chartData = chartDataYear;

  return (
    <>
      <CustomChart
        chartData={chartData}
        barItem={barKeys.filter(({ visible }) => visible)}
      />

      <CustomLegend items={barKeys} onToggle={toggleBar} />
    </>
  );
}
