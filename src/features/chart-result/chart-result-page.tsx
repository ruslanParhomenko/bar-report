"use client";

import type { GetScheduleData } from "@/app/actions/schedule/schedule-action";
import type { GetTipsData } from "@/app/actions/tips/tips-action";
import { MonthPicker } from "@/components/input-controlled/month-range";
import NavTabs from "@/components/nav-tabs/nav-tabs";
import { TrashIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ChartResultChart } from "./chart-result-chart";
import { ChartResultTable } from "./chart-result-table";
import { NAV_TABS } from "./constants";
import type { ChartResultFilter } from "./types";
import { useChartResultData } from "./use-chart-result-data";

export default function ChartResultPage({
  dataSchedules,
  tipsDataYear,
  year,
}: {
  dataSchedules: { month: string; data: GetScheduleData[] }[] | null;
  tipsDataYear: GetTipsData[] | null;
  year: string;
}) {
  const role = useSearchParams().get("tab") || "barmen";
  const [filters, setFilters] = useState<ChartResultFilter>("employees");

  const {
    range,
    setRange,
    activeName,
    setActiveName,
    uniqueEmployees,
    monthsToDisplay,
    dataSchedulesPrevMonth,
    tableData,
    chartDataByEmployee,
    chartDataByMonth,
  } = useChartResultData({ dataSchedules, tipsDataYear, year, role });

  const chartData =
    filters === "month" ? chartDataByMonth : chartDataByEmployee;

  const hasScheduleData = (month: string) =>
    dataSchedulesPrevMonth?.some(
      (m) => m.month.toLowerCase() === month.toLowerCase(),
    ) ?? false;

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2 md:flex-row md:gap-6 md:p-1 print:hidden">
        <NavTabs
          navItems={NAV_TABS}
          activeTab={filters}
          handleTabChange={(value) => setFilters(value as ChartResultFilter)}
          withSelect
        />
        <div className="flex items-center gap-2">
          <MonthPicker value={range} onChange={setRange} />

          <button
            disabled={!range}
            type="button"
            onClick={() => setRange(undefined)}
            className="w-2 md:w-4"
          >
            {range && <TrashIcon className="text-rd h-4 w-4" />}
          </button>
        </div>
      </div>

      {filters === "table" ? (
        <ChartResultTable
          tableData={tableData}
          monthsToDisplay={monthsToDisplay}
          hasScheduleData={hasScheduleData}
          chartDataByEmployee={chartDataByEmployee}
        />
      ) : (
        <ChartResultChart
          chartData={chartData}
          filters={filters}
          uniqueEmployees={uniqueEmployees}
          activeName={activeName}
          onSelectName={setActiveName}
        />
      )}
    </>
  );
}
