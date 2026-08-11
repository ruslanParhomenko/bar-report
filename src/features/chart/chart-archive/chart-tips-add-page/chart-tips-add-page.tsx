"use client";
import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import NameFilter from "@/components/chart/name-filter";
import { BarConfig } from "@/components/chart/types";
import {
  MonthPicker,
  MonthRange,
} from "@/components/input-controlled/month-range";
import { GetTipsAddByYear } from "@/features/staff/bar/tips-add/model/type";
import { useAbility } from "@/providers/ability-provider";
import { useMonthDays } from "@/providers/month-days-provider";
import { filterByMonthRange } from "@/utils/filter-by-month-range";
import { toggleBarVisibility } from "@/utils/toggle-bar-visibility";
import { useMemo, useState } from "react";
import {
  getChartDataByEmployee,
  getChartDataTipsByDay,
  getChartDataTipsFromYear,
} from "./utils";

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
  const { isAdmin, isManager, isUser } = useAbility();
  const canSeeAll = isAdmin || isManager || isUser;

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

  if (!canSeeAll) {
    return (
      <div className="text-rd flex h-full items-center justify-center">
        no permissions
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between">
      {tab === "tips-year" && <MonthPicker value={range} onChange={setRange} />}
      <CustomChart
        chartData={chartData}
        barItem={barKeys.filter(({ visible }) => visible)}
        disableTooltip={!isAdmin}
        disableYAxis={!isAdmin}
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
