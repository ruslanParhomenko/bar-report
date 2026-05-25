"use client";
import { GetTipsData } from "@/app/actions/tips/tips-action";
import CustomChart from "@/components/chart/custom-chart";
import {
  MonthPicker,
  MonthRange,
} from "@/components/input-controlled/month-range";
import { useMonthDays } from "@/providers/month-days-provider";
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

  const { month } = useMonthDays();

  const [range, setRange] = useState<MonthRange>();

  const dataTipsMonth = dataTipsYear?.find((data) => data.id === month) || null;

  const getMonthIndex = (id: string) => MONTHS.indexOf(id);

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
      .filter((row) => row.tips > 0)
      .sort((a, b) => b.tips - a.tips);
  }, [dataTipsPrevMonth]);

  const chartDataMonth =
    dataTipsMonth?.tipsData.rowEmployeesTips.map((row) => ({
      name: row.employee.split(" ")[0] + " " + row.employee.split(" ")[1][0],
      tips: row.tipsByDay.reduce((sum, t) => sum + Number(t), 0),
    })) ?? [];

  const BAR_KEYS = [{ key: "tips", color: "var(--color-bl)", label: "Tips" }];

  const chartData = tab === "month" ? chartDataMonth : chartDataYear;

  return (
    <>
      {tab === "range" && (
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
        withLegend
        vertical={tab === "year" || tab === "range"}
      />
    </>
  );
}
