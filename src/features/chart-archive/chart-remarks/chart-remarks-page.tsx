"use client";
import { YearData } from "@/app/actions/remarks/remarks-action";
import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import {
  MonthPicker,
  MonthRange,
} from "@/components/input-controlled/month-range";
import { MONTHS } from "@/utils/get-month-days";
import { TrashIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { getChartDataFromYear } from "./utils";

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
}: {
  dataRemarks: YearData[];
}) {
  const [range, setRange] = useState<MonthRange>();

  const [visibleBars, setVisibleBars] = useState<Record<BarKey, boolean>>({
    reason: false,
    penalty: true,
    bonus: true,
    hours: false,
  });

  const toggleBar = (key: BarKey) => {
    setVisibleBars((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const getMonthIndex = (id: string) => MONTHS.indexOf(id);

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
  const chartData = chartDataYear;

  return (
    <>
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

      <CustomChart
        chartData={chartData}
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
