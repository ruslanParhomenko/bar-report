"use client";
import CustomChart from "@/components/chart/custom-chart";
import NameFilter from "@/components/chart/name-filter";
import { BarConfig } from "@/components/chart/types";
import {
  MonthPicker,
  MonthRange,
} from "@/components/input-controlled/month-range";
import { GetTipsData } from "@/features/staff/tips/model/type";
import { cn } from "@/lib/utils";
import { filterByMonthRange } from "@/utils/filter-by-month-range";
import { MONTHS } from "@/utils/get-month-days";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const ITEM_KEYS = ["tips"] as const;
type BarKey = BarConfig<(typeof ITEM_KEYS)[number]>;

const BAR_KEYS: BarKey[] = [
  { key: "tips", color: "var(--color-bl)", visible: true },
];

export default function ChartTipsPage({
  dataTipsYear,
}: {
  dataTipsYear: GetTipsData[] | null;
}) {
  if (!dataTipsYear) return null;
  const tab = useSearchParams().get("tab");

  const [range, setRange] = useState<MonthRange>();
  const [activeName, setActiveName] = useState<string>("");

  const uniqueEmployees = [
    ...new Set(
      dataTipsYear
        ?.flatMap((month) => month.tipsData.rowEmployeesTips)
        .map((row) => row.employee.trim()),
    ),
  ];

  const dataTipsPrevMonth = useMemo(
    () => filterByMonthRange(dataTipsYear, range),
    [dataTipsYear, range],
  );

  const chartDataYear = useMemo(() => {
    const totals = new Map<string, number>();

    (dataTipsPrevMonth ?? []).forEach((monthData) => {
      monthData.tipsData.rowEmployeesTips.forEach((row) => {
        const name = row.employee.trim();
        const tips = row.tipsByDay.reduce((sum, t) => sum + Number(t || 0), 0);
        totals.set(name, (totals.get(name) ?? 0) + tips);
      });
    });

    return Array.from(totals.entries())
      .map(([name, tips]) => ({
        name: name.split(" ")[0],
        tips,
      }))
      .filter((row) => row.tips > 0);
  }, [dataTipsPrevMonth]);

  const chartDataByEmployee = !activeName
    ? []
    : MONTHS.map((monthId) => {
        const monthData = dataTipsYear?.find((m) => m.id === monthId);

        let tips = 0;

        (monthData?.tipsData.rowEmployeesTips ?? [])
          .filter((employee) => employee.employee.trim() === activeName)
          .forEach((employee) => {
            employee.tipsByDay.forEach((a) => {
              const val = parseFloat(a);
              if (!isNaN(val)) {
                tips += val;
              }
            });
          });

        return {
          name: monthId,
          tips: parseFloat(tips.toFixed(0)),
        };
      });

  const CHART_DATA_BY_TAB = {
    "tips-employee": chartDataByEmployee,
    "tips-year": chartDataYear,
  };

  const chartData = CHART_DATA_BY_TAB[tab as keyof typeof CHART_DATA_BY_TAB];

  return (
    <div className="flex flex-col items-center justify-between">
      {tab === "tips-year" && <MonthPicker value={range} onChange={setRange} />}
      <CustomChart
        chartData={chartData}
        barItem={BAR_KEYS}
        vertical={chartData.length > 25}
        className={cn(tab === "tips-year" ? "h-[80dvh]" : "h-[74dvh]")}
      />
      <NameFilter
        names={uniqueEmployees}
        activeName={activeName}
        onChange={setActiveName}
        isVisible={tab === "tips-employee"}
      />
    </div>
  );
}
