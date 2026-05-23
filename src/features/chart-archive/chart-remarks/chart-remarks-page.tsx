"use client";
import { YearData } from "@/app/actions/remarks/remarks-action";
import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import {
  MonthPicker,
  MonthRange,
} from "@/components/input-controlled/month-range";
import { ChartConfig } from "@/components/ui/chart";
import { useMonthDays } from "@/providers/month-days-provider";
import { MONTHS } from "@/utils/get-month-days";
import { TrashIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { getChartDataFromMonth, getChartDataFromYear } from "./utils";

export type ChartDataItem = {
  name: string;
  reason: number;
  bonus: number;
  penalty: number;
  hours: number;
};

type BarKey = keyof Omit<ChartDataItem, "name">;

type BarItem = {
  key: BarKey;
  color: string;
  label: string;
};

const BAR_KEYS: BarItem[] = [
  { key: "reason", color: "var(--color-gr)", label: "Reason" },
  { key: "penalty", color: "var(--color-rd)", label: "Penalty" },
  { key: "bonus", color: "var(--color-bl)", label: "Bonus" },
  { key: "hours", color: "var(--color-gn)", label: "Hours" },
];

export default function ChartRemarksPage({
  dataRemarks,
  tab,
}: {
  dataRemarks: YearData[];
  tab: string;
}) {
  const { month } = useMonthDays();

  const [range, setRange] = useState<MonthRange>();

  const [visibleBars, setVisibleBars] = useState<Record<BarKey, boolean>>({
    reason: true,
    penalty: true,
    bonus: true,
    hours: true,
  });

  const toggleBar = (key: BarKey) => {
    setVisibleBars((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const getMonthIndex = (id: string) => MONTHS.indexOf(id);

  const dataRemarksMonth =
    dataRemarks.find((data) => data.id === month) || null;

  const chartDataMonth = dataRemarksMonth
    ? getChartDataFromMonth(dataRemarksMonth)
    : [];

  const dataRemarksPrevMonth = useMemo(() => {
    if (range?.from === undefined || range?.to === undefined) {
      return dataRemarks;
    }

    const from = range.from;
    const to = range.to;

    return dataRemarks?.filter((data) => {
      const idx = getMonthIndex(data.id);
      return idx >= from && idx <= to;
    });
  }, [range, dataRemarks]);
  const chartDataYear = getChartDataFromYear(dataRemarksPrevMonth || []);
  const chartData = tab === "penalty-month" ? chartDataMonth : chartDataYear;

  const chartConfig = {
    reason: { label: "Reason", color: "var(--color-gr)" },
    penalty: { label: "Penalty", color: "var(--color-rd)" },
    bonus: { label: "Bonus", color: "var(--color-bl)" },
    hours: { label: "Hours", color: "var(--color-gn)" },
  } satisfies ChartConfig;

  return (
    <>
      {tab === "penalty-year" && (
        <div className="flex items-center justify-center gap-6 p-2">
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
        chartConfig={chartConfig}
        barItem={BAR_KEYS.filter(({ key }) => visibleBars[key])}
        className="h-[77dvh]"
      />
      <CustomLegend
        items={BAR_KEYS}
        visibleItems={visibleBars}
        onToggle={toggleBar}
      />
    </>
  );
}
