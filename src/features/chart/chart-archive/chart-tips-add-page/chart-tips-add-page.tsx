"use client";
import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import NameFilter from "@/components/chart/name-filter";
import { BarConfig } from "@/components/chart/types";
import {
  MonthPicker,
  MonthRange,
} from "@/components/input-controlled/month-range";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { GetTipsAddByYear } from "@/features/staff/bar/tips-add/model/type";
import { useAccessCheck } from "@/hooks/use-tab-access";
import { filterByMonthRange } from "@/utils/filter-by-month-range";
import { toggleBarVisibility } from "@/utils/toggle-bar-visibility";
import { useMemo, useState } from "react";
import {
  getChartDataByEmployee,
  getChartDataTipsByDay,
  getChartDataTipsFromYear,
} from "./utils";
import { useMonthDays } from "@/hooks/use-month-days";

const ITEM_KEYS = ["mdl", "chips", "total", "result"] as const;
type BarKey = BarConfig<(typeof ITEM_KEYS)[number]>;

const BAR_KEYS: BarKey[] = [
  { key: "mdl", color: "var(--color-bl)", visible: false },
  { key: "chips", color: "var(--color-gn)", visible: false },
  { key: "total", color: "var(--color-black)", visible: false },
  { key: "result", color: "var(--color-rd)", visible: true },
];

export default function ChartTipsAddPage({
  dataTipsAdd,
  tab,
}: {
  dataTipsAdd: GetTipsAddByYear[];
  tab: string;
}) {
  const hasAccess = useAccessCheck();

  const { month } = useMonthDays();

  const [barKeys, setBarKeys] = useState(BAR_KEYS);
  const [range, setRange] = useState<MonthRange>();
  const [activeName, setActiveName] = useState<string>("");

  const monthData = dataTipsAdd?.find((data) => data.id === month) || null;

  const dataTipsPrevMonth = useMemo(
    () => filterByMonthRange(dataTipsAdd, range),
    [range, dataTipsAdd],
  );

  const uniqueEmployees = [
    ...new Set(
      dataTipsAdd.flatMap((month) =>
        month.tipsAdd
          .flatMap((day) => day.tipsAdd)
          .map((employee) => employee.employeeName.trim()),
      ),
    ),
  ];

  const chartDataByEmployee = getChartDataByEmployee(dataTipsAdd, activeName);
  const chartDataTipsByDay = getChartDataTipsByDay(monthData, activeName);
  const chartDataTipsFromYear = getChartDataTipsFromYear(dataTipsPrevMonth);

  const CHART_DATA_MAP = {
    "tips-day": chartDataTipsByDay,
    "tips-year": chartDataTipsFromYear,
    "tips-employee": chartDataByEmployee,
  };

  const chartData = CHART_DATA_MAP[tab as keyof typeof CHART_DATA_MAP] ?? [];

  const toggleBar = (key: BarKey["key"]) =>
    setBarKeys((prev) => toggleBarVisibility(prev, key));

  if (!hasAccess) return <InsufficientRights />;

  return (
    <div className="flex flex-col items-center justify-between">
      {tab === "tips-year" && <MonthPicker value={range} onChange={setRange} />}
      <CustomChart
        chartData={chartData}
        barItem={barKeys.filter(({ visible }) => visible)}
        vertical={chartData.length > 25}
        className={
          tab === "tips-employee" || tab === "tips-day" ? "h-[74dvh]" : ""
        }
      />

      <CustomLegend items={barKeys} onToggle={toggleBar} />
      <NameFilter
        names={uniqueEmployees}
        activeName={activeName}
        onChange={setActiveName}
        isVisible={tab === "tips-employee" || tab === "tips-day"}
      />
    </div>
  );
}
