"use client";

import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import NameFilter from "@/components/chart/name-filter";
import { BarConfig } from "@/components/chart/types";
import {
  MonthPicker,
  MonthRange,
} from "@/components/input-controlled/month-range";
import { GetTTNData } from "@/features/finance/ttn/moda-month/model/type";
import { GetTtnNbmData } from "@/features/finance/ttn/nbm-month/model/type";
import { GetNbmProductsData } from "@/features/finance/ttn/nbm-products/model/type";
import { DataTTN } from "@/features/setting/model/type";
import { useMonthDays } from "@/hooks/use-month-days";
import { MONTHS } from "@/utils/get-month-days";
import { toggleBarVisibility } from "@/utils/toggle-bar-visibility";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const ITEM_KEYS = ["payment", "purchase", "final"] as const;
type BarKey = BarConfig<(typeof ITEM_KEYS)[number]>;

const BAR_KEYS: BarKey[] = [
  { key: "payment", color: "var(--color-bl)", visible: false },
  { key: "purchase", color: "var(--color-rd)", visible: true },
  { key: "final", color: "var(--color-gn)", visible: false },
];

export default function ChartTTNPage({
  agentTTN,
  dataTTN,
  dataNbmTtn,
  dataProductsNbm,
}: {
  agentTTN: DataTTN | null;
  dataTTN: GetTTNData[] | null;
  dataNbmTtn: GetTtnNbmData[] | null;
  dataProductsNbm: GetNbmProductsData[] | null;
}) {
  const { monthDays, month } = useMonthDays();
  const tab = useSearchParams().get("tab");

  const [activeName, setActiveName] = useState<string>("");
  const [range, setRange] = useState<MonthRange>();
  const [barKeys, setBarKeys] = useState(BAR_KEYS);

  const uniqueAgents = agentTTN?.agent || [];
  const uniqueAgentsNbm = agentTTN?.agentNbm || [];

  const uniqueProducts = [
    ...new Set(
      dataProductsNbm
        ?.flatMap((product) => product.dataProducts)
        .flatMap((product) => Object.keys(product.rowProducts)),
    ),
  ];

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

    agentTTN?.agent.forEach((agent) => {
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
      name: product,
      payment: 0,
      purchase: Number(purchase.toFixed(0)),
      final: Number(purchase.toFixed(0)),
    };
  });

  const chartDataAgentNbm = uniqueAgentsNbm?.map((agent) => {
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

  const chartDataAgent = agentTTN?.agent.map((agent) => {
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

    agentTTN?.agent.forEach((agent) => {
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

  const toggleBar = (key: BarKey["key"]) =>
    setBarKeys((prev) => toggleBarVisibility(prev, key));

  const CHART_DATA_BY_TAB = {
    "moda-month": chartDataMonth,
    "nbm-month": chartDataMonthNbm,
    "products-month": chartDataProductMonth,
    "moda-day": chartDataDay,
    "moda-year": chartDataYear,
    "moda-agent": chartDataAgent?.filter(
      (data) => data.payment > 0 || data.purchase > 0,
    ),
    "nbm-agent": chartDataAgentNbm?.filter(
      (data) => data.payment > 0 || data.purchase > 0,
    ),
    "nbm-products": chartDataProductNbm,
  };

  const chartData =
    CHART_DATA_BY_TAB[tab as keyof typeof CHART_DATA_BY_TAB] || [];

  const totalPurchase = chartData
    ?.reduce((acc, item) => acc + item.purchase, 0)
    .toFixed(0);
  const totalPayment = chartData
    ?.reduce((acc, item) => acc + item.payment, 0)
    .toFixed(0);
  return (
    <>
      <div className="flex items-center justify-center gap-6 p-1">
        <div className="flex items-center justify-center gap-12 text-[10px] font-bold tracking-widest">
          <span className="text-bl">{totalPayment || ""}</span>

          <span className="text-rd">{totalPurchase || ""}</span>
        </div>
        {(tab === "moda-agent" ||
          tab === "nbm-agent" ||
          tab === "nbm-products") && (
          <MonthPicker value={range} onChange={setRange} />
        )}
      </div>
      <CustomChart
        chartData={chartData}
        barItem={barKeys.filter(({ visible }) => visible)}
        vertical={
          (tab === "moda-agent" ||
            tab === "product-nbm" ||
            tab === "nbm-products") &&
          true
        }
        className={
          tab === "moda-month" ||
          tab === "nbm-month" ||
          tab === "products-month"
            ? "h-[70dvh]"
            : "h-[77dvh]"
        }
      />

      <CustomLegend items={barKeys} onToggle={toggleBar} />

      <NameFilter
        names={uniqueAgents}
        activeName={activeName}
        onChange={setActiveName}
        isVisible={tab === "moda-month"}
      />

      <NameFilter
        names={uniqueAgentsNbm}
        activeName={activeName}
        onChange={setActiveName}
        isVisible={tab === "nbm-month"}
      />

      <NameFilter
        names={uniqueProducts}
        activeName={activeName}
        onChange={setActiveName}
        isVisible={tab === "products-month"}
      />
    </>
  );
}
