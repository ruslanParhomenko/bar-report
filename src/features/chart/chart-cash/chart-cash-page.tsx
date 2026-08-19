"use client";
import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import { BarConfig } from "@/components/chart/types";
import { GetCashData } from "@/features/finance/cash/model/type";
import { useMonthDays } from "@/hooks/use-month-days";
import { MONTHS } from "@/utils/get-month-days";
import { toggleBarVisibility } from "@/utils/toggle-bar-visibility";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const ITEM_KEYS = ["cash", "visa", "nbm-coll", "bank-coll", "banquet"] as const;
type BarKey = BarConfig<(typeof ITEM_KEYS)[number]>;

const BAR_KEYS: BarKey[] = [
  { key: "cash", color: "var(--color-gn)", visible: true },
  { key: "visa", color: "var(--color-rd)", visible: false },
  { key: "nbm-coll", color: "var(--color-bl)", visible: false },
  { key: "bank-coll", color: "var(--color-primary)", visible: false },
  { key: "banquet", color: "var(--color-yl)", visible: false },
];
export default function ChartCashPage({
  dataCashYear,
}: {
  dataCashYear: GetCashData[] | null;
}) {
  const { monthDays, month } = useMonthDays();

  const tab = useSearchParams().get("tab");

  const [barKeys, setBarKeys] = useState(BAR_KEYS);

  const dataCash = dataCashYear?.find((cash) => cash.id === month)?.cashData
    .rowCashData;

  const chartDataMonth = monthDays.map((day, index) => ({
    name: String(day.day),
    cash: Number(dataCash?.cash[index]) || 0,
    visa: Number(dataCash?.visaTerminalByDay[index]) || 0,
    "nbm-coll": Number(dataCash?.nbmCollectionByDay[index]) || 0,
    "bank-coll": Number(dataCash?.bankCollectionByDay[index]) || 0,
    banquet: Number(dataCash?.banquetBarByDay[index]) || 0,
  }));

  const chartDataYear = MONTHS.map((month) => {
    const data = dataCashYear?.find((cash) => cash.id === month)?.cashData
      .rowCashData;
    return {
      name: month,
      cash: Number(data?.cash.reduce((a, b) => a + +b, 0)) || 0,
      visa: Number(data?.visaTerminalByDay.reduce((a, b) => a + +b, 0)) || 0,
      "nbm-coll":
        Number(data?.nbmCollectionByDay.reduce((a, b) => a + +b, 0)) || 0,
      "bank-coll":
        Number(data?.bankCollectionByDay.reduce((a, b) => a + +b, 0)) || 0,
      banquet: Number(data?.banquetBarByDay.reduce((a, b) => a + +b, 0)) || 0,
    };
  });

  const toggleBar = (key: BarKey["key"]) => {
    setBarKeys((prev) => toggleBarVisibility(prev, key));
  };

  const CHART_BY_FILTER = {
    month: chartDataMonth,
    year: chartDataYear,
  };

  const chartData = CHART_BY_FILTER[tab as "month" | "year"];
  return (
    <>
      <CustomChart
        chartData={chartData}
        barItem={barKeys.filter(({ visible }) => visible)}
      />

      <CustomLegend items={BAR_KEYS} onToggle={toggleBar} />
    </>
  );
}
