"use client";
import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import NameFilter from "@/components/chart/name-filter";
import { BarConfig } from "@/components/chart/types";
import { GetTipsAddYearEmployee } from "@/features/chart/chart-archive/chart-tips-add-employee/model/type";
import { getChartDataByEmployee } from "@/features/chart/chart-archive/chart-tips-add-employee/utils/get-chart-data-tips-add-employee";
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

export default function ChartTipsAddEmployee({
  dataTipsAddYear,
}: {
  dataTipsAddYear: GetTipsAddYearEmployee[];
}) {
  const [activeName, setActiveName] = useState<string>("");
  const [barKeys, setBarKeys] = useState(BAR_KEYS);

  const chartDataByEmployee = getChartDataByEmployee(
    dataTipsAddYear,
    activeName,
  );

  const uniqueEmployees = [
    ...new Set(
      dataTipsAddYear.flatMap((month) =>
        month.tipsAdd
          .flatMap((day) => day.tipsAdd)
          .map((employee) => employee.employeeName.trim()),
      ),
    ),
  ];
  const toggleBar = (key: BarKey["key"]) =>
    setBarKeys((prev) => toggleBarVisibility(prev, key));
  return (
    <div className="flex flex-col items-center justify-between">
      <CustomChart
        chartData={chartDataByEmployee}
        barItem={barKeys.filter(({ visible }) => visible)}
        vertical={chartDataByEmployee.length > 25}
        className="h-[74dvh]"
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
