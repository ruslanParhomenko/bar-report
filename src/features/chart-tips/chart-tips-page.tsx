"use client";
import { GetTipsData } from "@/app/actions/tips/tips-action";
import CustomChart from "@/components/chart/custom-chart";
import {
  MonthPicker,
  MonthRange,
} from "@/components/input-controlled/month-range";
import { cn } from "@/lib/utils";
import { MONTHS } from "@/utils/get-month-days";
import { TrashIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function ChartTipsPage({
  dataTipsYear,
}: {
  dataTipsYear: GetTipsData[] | null;
}) {
  const tab = useSearchParams().get("tab");

  const [range, setRange] = useState<MonthRange>();
  const [activeName, setActiveName] = useState<string>("");

  const getMonthIndex = (id: string) => MONTHS.indexOf(id);

  // chart data by employee for month view
  const uniqueEmployees = useMemo(() => {
    const employeeSet = new Set<string>();
    const dataTipsAllDay = dataTipsYear?.flatMap(
      (month) => month.tipsData.rowEmployeesTips,
    );
    dataTipsAllDay?.forEach((employee) => {
      employeeSet.add(employee.employee.trim());
    });
    return Array.from(employeeSet);
  }, [dataTipsYear]);

  const dataTipsPrevMonth = useMemo(() => {
    if (range?.from === undefined || range?.to === undefined) {
      return dataTipsYear;
    }

    const from = range.from;
    const to = range.to;

    return dataTipsYear?.filter((data) => {
      const idx = getMonthIndex(data.id);
      return idx >= from && idx <= to;
    });
  }, [range, dataTipsYear]);

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

  // chart data by employee for year view

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

  const BAR_KEYS = [{ key: "tips", color: "var(--color-bl)", label: "Tips" }];

  const CHART_DATA_BY_TAB = {
    "tips-employee": chartDataByEmployee,
    "tips-year": chartDataYear,
  };

  const chartData = CHART_DATA_BY_TAB[tab as keyof typeof CHART_DATA_BY_TAB];

  return (
    <>
      {tab === "tips-year" && (
        <div className="flex items-center justify-center gap-6 px-6">
          <MonthPicker value={range} onChange={setRange} />
          <button
            disabled={!range}
            type="button"
            onClick={() => setRange(undefined)}
            className="w-4"
          >
            {range && <TrashIcon className="text-rd h-4 w-4" />}
          </button>
        </div>
      )}
      <CustomChart
        chartData={chartData}
        barItem={BAR_KEYS}
        vertical={chartData.length > 25}
        className={cn(tab === "tips-year" ? "h-[80dvh]" : "h-[74dvh]")}
      />
      <div className="flex flex-wrap justify-center gap-1 md:px-4 md:pb-2">
        {tab === "tips-employee" &&
          uniqueEmployees.map((name) => (
            <span
              key={name}
              onClick={() =>
                setActiveName((prev) => (prev === name ? "" : name))
              }
              className={cn(
                "cursor-pointer rounded-full px-1 py-1 text-xs transition-opacity md:px-3",
                activeName && activeName !== name && "opacity-35",
                activeName !== name && "print:hidden",
              )}
            >
              {name}
            </span>
          ))}
      </div>
    </>
  );
}
