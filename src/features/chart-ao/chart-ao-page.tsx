"use client";
import { GetAoData } from "@/app/actions/a-o/ao-action";
import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import { MONTHS } from "@/utils/get-month-days";
import { useState } from "react";

type ChartDataItem = {
  name: string;
  nori: number;
  bar: number;
  nbm: number;
  zn: number;
  moda: number;
};

type BarKey = keyof Omit<ChartDataItem, "name">;

type BarItem = {
  key: BarKey;
  color: string;
  label: string;
};

export default function ChartAOPage({
  dataAOYear,
}: {
  dataAOYear: GetAoData[] | null;
}) {
  const [visibleBars, setVisibleBars] = useState<Record<BarKey, boolean>>({
    nori: false,
    bar: false,
    nbm: false,
    zn: false,
    moda: true,
  });

  const chartDataYear = MONTHS.map((monthName) => {
    const monthData = dataAOYear?.find((d) => d.id === monthName);

    let totalNori = 0;
    let totalBar = 0;
    let totalNbm = 0;
    let totalZn = 0;

    const rowAOData = monthData?.aoData?.rowAOData || {};

    totalZn += rowAOData.advanceZBN?.reduce(
      (sum, v) => sum + (Number(v) || 0),
      0,
    );
    totalNbm += rowAOData.advanceNBMByDay?.reduce(
      (sum, v) => sum + (Number(v) || 0),
      0,
    );
    totalBar +=
      rowAOData.purchaseBarByDay?.reduce(
        (sum, v) => sum + (Number(v) || 0),
        0,
      ) +
      rowAOData.purchaseCookByDay?.reduce(
        (sum, v) => sum + (Number(v) || 0),
        0,
      ) +
      rowAOData.ttnBarByDay?.reduce((sum, v) => sum + (Number(v) || 0), 0);
    totalNori +=
      rowAOData.purchaseModaByDay?.reduce(
        (sum, v) => sum + (Number(v) || 0),
        0,
      ) + rowAOData.ttnModaByDay?.reduce((sum, v) => sum + (Number(v) || 0), 0);

    return {
      name: monthName,
      nori: Number(totalNori.toFixed(0)) || 0,
      bar: Number(totalBar.toFixed(0)) || 0,
      nbm: Number(totalNbm.toFixed(0)) || 0,
      zn: Number(totalZn.toFixed(0)) || 0,
      moda: Number((totalNori + totalBar).toFixed(0)) || 0,
    };
  });

  const BAR_KEYS: BarItem[] = [
    { key: "nori", color: "var(--color-yl)", label: "Nori" },
    { key: "bar", color: "var(--color-gr)", label: "Bar" },
    { key: "nbm", color: "var(--color-rd)", label: "NBM" },
    { key: "zn", color: "var(--color-gn)", label: "ZN" },
    { key: "moda", color: "var(--color-bl)", label: "Moda" },
  ];

  const toggleBar = (key: BarKey) => {
    setVisibleBars((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const chartData = chartDataYear;

  return (
    <>
      <CustomChart
        chartData={chartData}
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
