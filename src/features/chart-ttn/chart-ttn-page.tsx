"use client";
import { CreateDataTTN } from "@/app/actions/data-constants/data-ttn-action";
import { GetTTNData } from "@/app/actions/ttn/ttn-actions";
import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import {
  MonthPicker,
  MonthRange,
} from "@/components/input-controlled/month-range";
import { cn } from "@/lib/utils";
import { useMonthDays } from "@/providers/month-days-provider";
import { MONTHS } from "@/utils/get-month-days";
import { TrashIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

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

  const uniqueAgents = agentTTN.agent;

  const [visibleBars, setVisibleBars] = useState<Record<BarKey, boolean>>({
    payment: true,
    purchase: true,
    final: false,
  });
  const [activeName, setActiveName] = useState<string>("");
  const [range, setRange] = useState<MonthRange>();
  const getMonthIndex = (id: string) => MONTHS.indexOf(id);

  const dataTTNMonth = dataTTN?.find((data) => data.id === month);

  const dataTTNPrevMonth = useMemo(() => {
    if (range?.from === undefined || range?.to === undefined) {
      return dataTTN;
    }
    return (
      dataTTN?.filter((data) => {
        const idx = getMonthIndex(data.id);
        return idx >= range.from! && idx <= range.to!;
      }) || []
    );
  }, [dataTTN, range]);

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
      payment: Number(totalPayment.toFixed(2)),
      purchase: Number(totalPurchase.toFixed(2)),
      final: Number((totalPurchase - totalPayment).toFixed(2)),
    };
  });

  const chartDataAgent = agentTTN.agent.map((agent) => {
    let payment = 0;
    let purchase = 0;

    dataTTNPrevMonth?.forEach((monthData) => {
      const supplierData = monthData?.ttnData?.rowSuppliers?.[agent];
      if (!supplierData) return;

      payment += (supplierData.plus ?? []).reduce(
        (acc, v) => acc + (Number(v) || 0),
        0,
      );
      purchase += (supplierData.minus ?? []).reduce(
        (acc, v) => acc + Math.abs(Number(v) || 0),
        0,
      );
    });

    return {
      name: agent,
      payment: Number(payment.toFixed(0)),
      purchase: Number(purchase.toFixed(0)),
      final: Number((purchase - payment).toFixed(0)),
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
      payment: Number(totalPlus.toFixed(2)),
      purchase: Number(totalMinus.toFixed(2)),
      final: Number((totalMinus - totalPlus).toFixed(2)),
    };
  });

  const chartDataMonth = MONTHS.map((monthName) => {
    if (!activeName)
      return {
        name: monthName,
        payment: 0,
        purchase: 0,
        final: 0,
      };

    const dataForMonth = dataTTN?.find((data) => data.id === monthName)?.ttnData
      ?.rowSuppliers?.[activeName];

    const payment =
      dataForMonth?.plus?.reduce((acc, v) => acc + Number(v) || 0, 0) || 0;
    const purchase =
      dataForMonth?.minus?.reduce(
        (acc, v) => acc + Math.abs(Number(v) || 0),
        0,
      ) || 0;
    const final = purchase - payment;

    return {
      name: monthName,
      payment: Number(payment.toFixed(0)),
      purchase: Number(purchase.toFixed(0)),
      final: Number(final.toFixed(0)),
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

  const CHART_DATA_BY_TAB: Record<string, ChartDataItem[]> = {
    year: chartDataYear,
    agent: chartDataAgent.filter(
      (data) => data.payment > 0 || data.purchase > 0,
    ),
    day: chartDataDay,
    month: chartDataMonth,
  };

  const chartData = CHART_DATA_BY_TAB[tab as keyof typeof CHART_DATA_BY_TAB];

  const heightByTab = {
    agent: "h-[74dvh]",
    day: "md:h-[80dvh] h-[76dvh]",
    month: "md:h-[70dvh] h-[58dvh]",
    year: "md:h-[80dvh] h-[76dvh]",
  };

  return (
    <>
      <div className="flex items-center justify-center gap-6 p-1">
        {tab === "agent" && <MonthPicker value={range} onChange={setRange} />}
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
        barItem={BAR_KEYS.filter(({ key }) => visibleBars[key as BarKey])}
        vertical={tab === "agent"}
        className={heightByTab[tab as keyof typeof heightByTab]}
      />

      <CustomLegend
        items={BAR_KEYS}
        visibleItems={visibleBars}
        onToggle={toggleBar}
      />
      <div className="flex flex-wrap justify-center gap-1 md:px-4 md:pb-2">
        {tab === "month" &&
          uniqueAgents.map((name) => (
            <span
              key={name}
              onClick={() =>
                setActiveName((prev) => (prev === name ? "" : name))
              }
              className={cn(
                "cursor-pointer rounded-full px-1 py-0.5 text-xs transition-opacity md:px-3 md:py-1",
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
