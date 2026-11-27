"use client";
import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import { BarConfig } from "@/components/chart/types";
import {
  MonthPicker,
  MonthRange,
} from "@/components/input-controlled/month-range";

import { GetTipsAddYearEmployee } from "@/features/chart/chart-archive/chart-tips-add-employee/model/type";
import { filterByMonthRange } from "@/utils/filter-by-month-range";
import { toggleBarVisibility } from "@/utils/toggle-bar-visibility";
import { useMemo, useState } from "react";
import { getChartDataTipsFromYear } from "../utils/get-chart-data-tips-add-year";

const ITEM_KEYS = ["mdl", "chips", "total", "result"] as const;
type BarKey = BarConfig<(typeof ITEM_KEYS)[number]>;

const BAR_KEYS: BarKey[] = [
  { key: "mdl", color: "var(--color-bl)", visible: false },
  { key: "chips", color: "var(--color-gn)", visible: false },
  { key: "total", color: "var(--color-black)", visible: false },
  { key: "result", color: "var(--color-rd)", visible: true },
];

export default function ChartTipsAddYear({
  dataTipsAddYear,
}: {
  dataTipsAddYear: GetTipsAddYearEmployee[];
}) {
  const [barKeys, setBarKeys] = useState(BAR_KEYS);
  const [range, setRange] = useState<MonthRange>();

  const dataTipsPrevMonth = useMemo(
    () => filterByMonthRange(dataTipsAddYear, range),
    [range, dataTipsAddYear],
  );

  const chartDataTipsFromYear = getChartDataTipsFromYear(dataTipsPrevMonth);

  const toggleBar = (key: BarKey["key"]) =>
    setBarKeys((prev) => toggleBarVisibility(prev, key));

  return (
    <div className="mt-2 flex flex-col items-center justify-between gap-2">
      <MonthPicker value={range} onChange={setRange} />
      <CustomChart
        chartData={chartDataTipsFromYear}
        barItem={barKeys.filter(({ visible }) => visible)}
        vertical={chartDataTipsFromYear.length > 25}
        className="h-[77dvh]"
      />

      <CustomLegend items={barKeys} onToggle={toggleBar} />
    </div>
  );
}
