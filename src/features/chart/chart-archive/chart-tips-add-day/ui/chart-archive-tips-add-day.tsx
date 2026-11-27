"use client";
import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import NameFilter from "@/components/chart/name-filter";
import { BarConfig } from "@/components/chart/types";
import { getChartDataTipsAddByDay } from "@/features/chart/chart-archive/chart-tips-add-day/utils/get-chart-data";
import type { GetTipsAddData } from "@/features/tips-add/model/type";
import { toggleBarVisibility } from "@/utils/toggle-bar-visibility";
import { useState } from "react";

const ITEM_KEYS = ["mdl", "chips", "total", "result"] as const;
type BarKey = BarConfig<(typeof ITEM_KEYS)[number]>;

const BAR_KEYS: BarKey[] = [
  { key: "mdl", color: "var(--color-bl)", visible: false },
  { key: "chips", color: "var(--color-gn)", visible: false },
  { key: "total", color: "var(--color-black)", visible: false },
  { key: "result", color: "var(--color-rd)", visible: true },
];

export default function ChartArchiveTipsAddDay({
  dataTipsAddMonth,
}: {
  dataTipsAddMonth: GetTipsAddData[] | null;
}) {
  if (!dataTipsAddMonth) return null;
  console.log("dataTipsAddMonth", dataTipsAddMonth);
  const [barKeys, setBarKeys] = useState(BAR_KEYS);
  const [activeName, setActiveName] = useState<string>("");

  const uniqueEmployees = [
    ...new Set(
      dataTipsAddMonth
        .flatMap((day) => day.tipsAdd)
        .map((employee) => employee.employeeName.trim()),
    ),
  ];

  const chartData = getChartDataTipsAddByDay(dataTipsAddMonth, activeName);
  const toggleBar = (key: BarKey["key"]) =>
    setBarKeys((prev) => toggleBarVisibility(prev, key));
  return (
    <div className="flex flex-col items-center justify-between">
      <CustomChart
        chartData={chartData}
        barItem={barKeys.filter(({ visible }) => visible)}
        vertical={chartData.length > 25}
      />

      <CustomLegend items={barKeys} onToggle={toggleBar} />
      <NameFilter
        names={uniqueEmployees}
        activeName={activeName}
        onChange={setActiveName}
        isVisible={true}
      />
    </div>
  );
}
