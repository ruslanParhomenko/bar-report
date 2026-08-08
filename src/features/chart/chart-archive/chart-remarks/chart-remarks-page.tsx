"use client";
import { YearData } from "@/app/actions/remarks/remarks-action";
import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";

import { BarConfig } from "@/components/chart/types";
import {
  MonthPicker,
  MonthRange,
} from "@/components/input-controlled/month-range";
import { filterByMonthRange } from "@/utils/filter-by-month-range";
import { toggleBarVisibility } from "@/utils/toggle-bar-visibility";
import { useMemo, useState } from "react";
import { getChartDataFromYear } from "./utils";

const ITEM_KEYS = ["reason", "bonus", "penalty", "hours"] as const;
type BarKey = BarConfig<(typeof ITEM_KEYS)[number]>;

const BAR_KEYS: BarKey[] = [
  { key: "reason", color: "var(--color-gr)", visible: true },
  { key: "penalty", color: "var(--color-rd)", visible: false },
  { key: "bonus", color: "var(--color-bl)", visible: true },
  { key: "hours", color: "var(--color-gn)", visible: false },
];

export default function ChartRemarksPage({
  dataRemarks,
}: {
  dataRemarks: YearData[];
}) {
  const [range, setRange] = useState<MonthRange>();

  const [barKeys, setBarKeys] = useState(BAR_KEYS);

  const toggleBar = (key: BarKey["key"]) =>
    setBarKeys((prev) => toggleBarVisibility(prev, key));

  const dataRemarksPrevMonth = useMemo(
    () => filterByMonthRange(dataRemarks, range),
    [dataRemarks, range],
  );

  const chartDataYear = getChartDataFromYear(dataRemarksPrevMonth || []);

  const chartData = chartDataYear.filter((item) => item.reason !== 0);

  return (
    <div className="flex flex-col items-center justify-between">
      <MonthPicker value={range} onChange={setRange} />

      <CustomChart
        chartData={chartData}
        barItem={barKeys.filter(({ visible }) => visible)}
        vertical={chartData.length > 25}
      />
      <CustomLegend items={barKeys} onToggle={toggleBar} />
    </div>
  );
}
