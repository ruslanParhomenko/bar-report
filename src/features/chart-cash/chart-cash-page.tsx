"use client";
import { GetCashData } from "@/app/actions/cash/cash-action";
import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import { ChartConfig } from "@/components/ui/chart";
import { useMonthDays } from "@/providers/month-days-provider";
import { MONTHS } from "@/utils/get-month-days";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

type ChartDataItem = {
  name: string;
  cash: number;
  visa: number;
  "nbm-coll": number;
  "bank-coll": number;
  banquet: number;
};
type BarKey = keyof Omit<ChartDataItem, "name">;

type BarItem = {
  key: BarKey;
  color: string;
  label: string;
};

export default function ChartCashPage({
  dataCashYear,
}: {
  dataCashYear: GetCashData[] | null;
}) {
  const { monthDays, month } = useMonthDays();

  const tab = useSearchParams().get("tab");

  const [visibleBars, setVisibleBars] = useState<Record<BarKey, boolean>>({
    cash: true,
    visa: true,
    "nbm-coll": true,
    "bank-coll": true,
    banquet: true,
  });

  const dataCash = dataCashYear?.find((cash) => cash.id === month)?.cashData
    .rowCashData;
  console.log(dataCashYear);

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

  const chartConfig = {
    cash: {
      label: "cash",
      color: "var(--color-gn)",
    },
    visa: {
      label: "visa",
      color: "var(--color-rd)",
    },
    "nbm-coll": {
      label: "nbm-coll",
      color: "var(--color-bl)",
    },
    "bank-coll": {
      label: "bank-coll",
      color: "var(--color-primary)",
    },
    banquet: {
      label: "banquet",
      color: "var(--color-yl)",
    },
  } satisfies ChartConfig;

  const BAR_KEYS: BarItem[] = [
    { key: "cash", color: "var(--color-gn)", label: "Cash" },
    { key: "visa", color: "var(--color-rd)", label: "Visa" },
    { key: "nbm-coll", color: "var(--color-bl)", label: "Nbm Coll" },
    { key: "bank-coll", color: "var(--color-primary)", label: "Bank Coll" },
    { key: "banquet", color: "var(--color-yl)", label: "Banquet" },
  ];
  const toggleBar = (key: BarKey) => {
    setVisibleBars((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const chartData = tab === "year" ? chartDataYear : chartDataMonth;
  return (
    <>
      <CustomChart
        chartData={chartData}
        chartConfig={chartConfig}
        barItem={BAR_KEYS.filter(({ key }) => visibleBars[key as BarKey])}
      />

      <CustomLegend
        items={BAR_KEYS}
        visibleItems={visibleBars}
        onToggle={toggleBar}
      />
    </>
  );
}
