"use client";
import { CreateDataTTN } from "@/app/actions/data-constants/data-ttn-action";
import { GetTTNData } from "@/app/actions/ttn/ttn-actions";
import { GetTtnNbmData } from "@/app/actions/ttn/ttn-nbm-action";
import { GetNbmProductsData } from "@/app/actions/ttn/ttn-nbm-products-action";
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
  dataNbmTtn,
  dataProductsNbm,
}: {
  agentTTN: CreateDataTTN;
  dataTTN: GetTTNData[] | null;
  dataNbmTtn: GetTtnNbmData[] | null;
  dataProductsNbm: GetNbmProductsData[] | null;
}) {
  const { monthDays, month } = useMonthDays();
  const tab = useSearchParams().get("tab");

  const uniqueAgents = agentTTN.agent;
  const uniqueAgentsNbm = agentTTN.agentNbm;

  const uniqueProducts = [
    ...new Set(
      dataProductsNbm
        ?.flatMap((product) => product.dataProducts)
        .flatMap((product) => Object.keys(product.rowProducts)),
    ),
  ];

  const [visibleBars, setVisibleBars] = useState<Record<BarKey, boolean>>({
    payment: false,
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

  const dataNbmTtnPrevMonth = useMemo(() => {
    if (range?.from === undefined || range?.to === undefined) {
      return dataNbmTtn;
    }
    return (
      dataNbmTtn?.filter((data) => {
        const idx = getMonthIndex(data.id);
        return idx >= range.from! && idx <= range.to!;
      }) || []
    );
  }, [dataNbmTtn, range]);

  const dataProductsNbmPrevMonth = useMemo(() => {
    if (range?.from === undefined || range?.to === undefined) {
      return dataProductsNbm;
    }
    return (
      dataProductsNbm?.filter((data) => {
        const idx = getMonthIndex(data.id);
        return idx >= range.from! && idx <= range.to!;
      }) || []
    );
  }, [dataProductsNbm, range]);

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

  const chartDataProductNbm = uniqueProducts.map((product) => {
    let purchase = 0;

    dataProductsNbmPrevMonth?.forEach((monthData) => {
      const supplierData = monthData?.dataProducts?.rowProducts?.[product];
      if (!supplierData) return;

      purchase += (supplierData.arrival ?? []).reduce(
        (acc, v) => acc + Math.abs(Number(v) || 0),
        0,
      );
    });

    return {
      name: product.slice(0, 6),
      payment: 0,
      purchase: Number(purchase.toFixed(0)),
      final: Number(purchase.toFixed(0)),
    };
  });

  const chartDataAgentNbm = uniqueAgentsNbm.map((agent) => {
    let purchase = 0;

    dataNbmTtnPrevMonth?.forEach((monthData) => {
      const supplierData = monthData?.ttnData?.rowSuppliers?.[agent];
      if (!supplierData) return;

      purchase += (supplierData.minus ?? []).reduce(
        (acc, v) => acc + Math.abs(Number(v) || 0),
        0,
      );
    });

    return {
      name: agent,
      payment: 0,
      purchase: Number(purchase.toFixed(0)),
      final: Number(purchase.toFixed(0)),
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

  const chartDataProductMonth = MONTHS.map((monthName) => {
    if (!activeName)
      return {
        name: monthName,
        payment: 0,
        purchase: 0,
        final: 0,
      };

    const dataForMonth = dataProductsNbm?.find((data) => data.id === monthName)
      ?.dataProducts?.rowProducts?.[activeName];

    const payment = 0;
    const purchase =
      dataForMonth?.arrival?.reduce(
        (acc, v) => acc + Math.abs(Number(v) || 0),
        0,
      ) || 0;
    const final = 0;

    return {
      name: monthName,
      payment: Number(payment.toFixed(0)),
      purchase: Number(purchase.toFixed(0)),
      final: Number(final.toFixed(0)),
    };
  });

  const chartDataMonthNbm = MONTHS.map((monthName) => {
    if (!activeName)
      return {
        name: monthName,
        payment: 0,
        purchase: 0,
        final: 0,
      };

    const dataForMonth = dataNbmTtn?.find((data) => data.id === monthName)
      ?.ttnData?.rowSuppliers?.[activeName];

    const payment = 0;
    const purchase =
      dataForMonth?.minus?.reduce(
        (acc, v) => acc + Math.abs(Number(v) || 0),
        0,
      ) || 0;
    const final = 0;

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
    "month-nbm": chartDataMonthNbm,
    "month-products": chartDataProductMonth,
    "agent-nbm": chartDataAgentNbm.filter(
      (data) => data.payment > 0 || data.purchase > 0,
    ),
    "product-nbm": chartDataProductNbm,
  };

  const chartData = CHART_DATA_BY_TAB[tab as keyof typeof CHART_DATA_BY_TAB];

  const heightByTab = {
    "agent-nbm": "h-[74dvh]",
    "product-nbm": "md:h-[74dvh] h-full",
    agent: "md:h-[74dvh] h-dvh",
    day: "h-dvh md:h-[78dvh]",
    month: "md:h-[70dvh] h-[58dvh]",
    "month-nbm": "md:h-[70dvh] h-[58dvh]",
    "month-products": "md:h-[65dvh] h-[58dvh]",
    year: "h-[76dvh]",
  };
  const totalPurchase = chartData
    .reduce((acc, item) => acc + item.purchase, 0)
    .toFixed(0);
  const totalPayment = chartData
    .reduce((acc, item) => acc + item.payment, 0)
    .toFixed(0);
  return (
    <>
      <div className="flex items-center justify-center gap-6 p-1">
        {(tab === "agent" || tab === "agent-nbm" || tab === "product-nbm") && (
          <MonthPicker value={range} onChange={setRange} />
        )}
        <button
          disabled={!range}
          type="button"
          onClick={() => setRange(undefined)}
          className="w-4"
        >
          {range && <TrashIcon className="text-rd h-4 w-4" />}
        </button>
      </div>
      <div className="mt-2 flex items-center justify-center gap-12 text-[10px] font-bold tracking-widest">
        {visibleBars.payment && <span className="text-bl">{totalPayment}</span>}
        {visibleBars.purchase && (
          <span className="text-rd">{totalPurchase}</span>
        )}
      </div>
      <CustomChart
        chartData={chartData}
        barItem={BAR_KEYS.filter(({ key }) => visibleBars[key as BarKey])}
        vertical={(tab === "agent" || tab === "product-nbm") && true}
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
        {tab === "month-nbm" &&
          uniqueAgentsNbm.map((name) => (
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

        {tab === "month-products" &&
          uniqueProducts.map((name) => (
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
