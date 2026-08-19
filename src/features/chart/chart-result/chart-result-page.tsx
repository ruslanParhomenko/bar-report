"use client";

import { MonthPicker } from "@/components/input-controlled/month-range";
import NavTabs from "@/components/nav-tabs/nav-tabs";
import { Employee } from "@/features/settings/create-employee/model/type";
import { GetScheduleData } from "@/features/staff/schedule/schedule-edit/model/type";
import { GetTipsData } from "@/features/staff/tips/model/type";
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
  employees,
  year,
}: {
  dataSchedules: { month: string; data: GetScheduleData[] }[] | null;
  tipsDataYear: GetTipsData[] | null;
  employees: Employee[];
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
  } = useChartResultData({
    dataSchedules,
    tipsDataYear,
    employees,
    year,
    role,
  });

  const CHART_DATA_BY_TAB = {
    employees: chartDataByEmployee,
    month: chartDataByMonth,
  };

  const chartData =
    CHART_DATA_BY_TAB[filters as keyof typeof CHART_DATA_BY_TAB];

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
          classTrigger="h-5"
          classTabs="h-6 bg-transparent"
          withSelect
        />

        {filters !== "month" && (
          <MonthPicker value={range} onChange={setRange} />
        )}
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
