"use client";
import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import NameFilter from "@/components/chart/name-filter";

import { BarConfig } from "@/components/chart/types";
import {
  MonthPicker,
  MonthRange,
} from "@/components/input-controlled/month-range";
import {
  getChartDataFromYear,
  getChartDataPenaltyByEmployee,
} from "@/features/chart/chart-archive/chart-remarks/utils";
import { GetRemarksYearData } from "@/features/penalty/model/type";

import { filterByMonthRange } from "@/utils/filter-by-month-range";
import { toggleBarVisibility } from "@/utils/toggle-bar-visibility";
import { useMemo, useState } from "react";

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
  tab,
}: {
  dataRemarks: GetRemarksYearData[];
  tab: string;
}) {
  const [barKeys, setBarKeys] = useState(BAR_KEYS);
  const [range, setRange] = useState<MonthRange>();
  const [activeName, setActiveName] = useState<string>("");

  const toggleBar = (key: BarKey["key"]) =>
    setBarKeys((prev) => toggleBarVisibility(prev, key));

  const dataRemarksPrevMonth = useMemo(
    () => filterByMonthRange(dataRemarks, range),
    [dataRemarks, range],
  );

  const uniqueEmployees = [
    ...new Set(
      dataRemarksPrevMonth.flatMap((month) =>
        month.remarks
          .flatMap((day) => day.remarks)
          .map((employee) => employee.name.trim()),
      ),
    ),
  ];

  const chartDataPenaltyByEmployee = getChartDataPenaltyByEmployee(
    dataRemarks,
    activeName,
  );

  const chartDataYear = getChartDataFromYear(dataRemarksPrevMonth || []);
  const CHART_DATA_MAP = {
    "penalty-year": chartDataYear.filter((item) => item.reason !== 0),
    "penalty-employee": chartDataPenaltyByEmployee,
  };

  const chartData = CHART_DATA_MAP[tab as keyof typeof CHART_DATA_MAP];

  return (
    <div className="flex flex-col items-center justify-between">
      <MonthPicker value={range} onChange={setRange} />

      <CustomChart
        chartData={chartData}
        barItem={barKeys.filter(({ visible }) => visible)}
        vertical={chartData.length > 25}
        className={tab === "penalty-employee" ? "h-[70dvh]" : ""}
      />
      <CustomLegend items={barKeys} onToggle={toggleBar} />

      <NameFilter
        names={uniqueEmployees}
        activeName={activeName}
        onChange={setActiveName}
        isVisible={tab === "penalty-employee"}
      />
    </div>
  );
}
