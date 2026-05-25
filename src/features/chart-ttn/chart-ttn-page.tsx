"use client";
import { CreateDataTTN } from "@/app/actions/data-constants/data-ttn-action";
import { GetTTNData } from "@/app/actions/ttn/ttn-actions";
import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import { useMonthDays } from "@/providers/month-days-provider";
import { MONTHS } from "@/utils/get-month-days";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

type ChartDataItem = {
  name: string;
  payment: number;
  purchase: number;
  final: number;
};

type BarKey = keyof Omit<ChartDataItem, "name">;

type BarItem = {
  key: BarKey;
  color: string;
  label: string;
};

export default function ChartTTNPage({
  agentTTN,
  dataTTN,
}: {
  agentTTN: CreateDataTTN;
  dataTTN: GetTTNData[] | null;
}) {
  const { monthDays, month } = useMonthDays();
  const tab = useSearchParams().get("tab");

  const [visibleBars, setVisibleBars] = useState<Record<BarKey, boolean>>({
    payment: true,
    purchase: true,
    final: true,
  });

  const dataTTNMonth = dataTTN?.find((data) => data.id === month);

  const chartDataDay = monthDays.map((day, index) => {
    let totalPayment = 0;
    let totalPurchase = 0;

    agentTTN.agent.forEach((agent) => {
      const supplierData = dataTTNMonth?.ttnData?.rowSuppliers?.[agent];
      if (
        supplierData &&
        supplierData.plus?.[index] !== undefined &&
        supplierData.minus?.[index] !== undefined
      ) {
        totalPayment += Number(supplierData.plus[index]) || 0;
        totalPurchase += Math.abs(Number(supplierData.minus[index]) || 0);
      }
    });

    return {
      name: String(day.day),
      payment: totalPayment,
      purchase: totalPurchase,
      final: totalPurchase - totalPayment,
    };
  });

  const chartDataMonth = agentTTN.agent.map((agent) => {
    const supplierData = dataTTNMonth?.ttnData?.rowSuppliers?.[agent];
    if (!supplierData) {
      return {
        name: agent,
        payment: 0,
        purchase: 0,
        final: 0,
      };
    }

    const payment = (supplierData.plus ?? []).reduce(
      (acc, v) => acc + (Number(v) || 0),
      0,
    );
    const purchase = (supplierData.minus ?? []).reduce(
      (acc, v) => acc + Math.abs(Number(v) || 0),
      0,
    );

    return {
      name: agent,
      payment,
      purchase,
      final: purchase - payment,
    };
  });

  const chartDataYear = MONTHS.map((monthName) => {
    const monthData = dataTTN?.find((d) => d.id === monthName);

    let totalPlus = 0;
    let totalMinus = 0;

    agentTTN.agent.forEach((agent) => {
      const supplierData = monthData?.ttnData?.rowSuppliers?.[agent];
      if (supplierData) {
        totalPlus += (supplierData.plus ?? []).reduce(
          (acc, v) => acc + (Number(v) || 0),
          0,
        );
        totalMinus += (supplierData.minus ?? []).reduce(
          (acc, v) => acc + Math.abs(Number(v) || 0),
          0,
        );
      }
    });

    return {
      name: monthName,
      payment: totalPlus,
      purchase: totalMinus,
      final: totalMinus - totalPlus,
    };
  });

  const BAR_KEYS: BarItem[] = [
    { key: "payment", color: "var(--color-bl)", label: "Payment" },
    { key: "purchase", color: "var(--color-rd)", label: "Purchase" },
    { key: "final", color: "var(--color-gn)", label: "Final" },
  ];

  const toggleBar = (key: BarKey) => {
    setVisibleBars((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const chartData =
    tab === "year"
      ? chartDataYear
      : tab === "day"
        ? chartDataDay
        : chartDataMonth;

  return (
    <>
      <CustomChart
        chartData={chartData}
        barItem={BAR_KEYS.filter(({ key }) => visibleBars[key as BarKey])}
        vertical={tab === "month"}
      />

      <CustomLegend
        items={BAR_KEYS}
        visibleItems={visibleBars}
        onToggle={toggleBar}
      />
    </>
  );
}
