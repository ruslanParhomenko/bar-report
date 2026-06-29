"use client";
import { GetTipsAddByYear } from "@/app/actions/tips-add/tips-add-actions";
import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import { useAbility } from "@/providers/ability-provider";
import { useMonthDays } from "@/providers/month-days-provider";
import { useState } from "react";

type ChartDataItem = {
  name: string;
  tipsMdl: number;
  tipsChips: number;
  tipsTotal: number;
  resultTips: number;
};

type BarKey = keyof Omit<ChartDataItem, "name">;
type BarItem = {
  key: BarKey;
  color: string;
  label: string;
};

export default function ChartTipsAddPage({
  dataTipsAdd,
  tab,
}: {
  dataTipsAdd: GetTipsAddByYear[];
  tab: string;
}) {
  const { isAdmin } = useAbility();

  const { month } = useMonthDays();

  const [visibleBars, setVisibleBars] = useState<Record<BarKey, boolean>>({
    tipsMdl: false,
    tipsChips: false,
    tipsTotal: false,
    resultTips: true,
  });

  const monthData = dataTipsAdd?.find((data) => data.id === month) || null;

  const chartDataMonth: ChartDataItem[] = (monthData?.tipsAdd ?? [])
    .slice()
    .sort((a, b) => parseInt(a.id) - parseInt(b.id))
    .map((day) => {
      const currency = parseFloat(day.currency);
      let tipsMdl = 0;
      let tipsChips = 0;
      let resultTips = 0;

      day.tipsAdd.forEach((employee) => {
        employee.amount.forEach((a) => {
          const val = parseFloat(a.value);
          if (a.typeAmount === "mdl") {
            tipsMdl += val;
          } else if (a.typeAmount === "chips") {
            tipsChips += val * currency;
          }
        });
        employee.resultAmount.forEach((r) => {
          resultTips += r.value;
        });
      });

      const tipsTotal = tipsMdl + tipsChips;

      return {
        name: day.id,
        tipsMdl: parseFloat(tipsMdl.toFixed(0)),
        tipsChips: parseFloat(tipsChips.toFixed(0)),
        tipsTotal: parseFloat(tipsTotal.toFixed(0)),
        resultTips: parseFloat(resultTips.toFixed(0)),
      };
    });
  // chartDataYear — один элемент на месяц (агрегат всех дней)
  const yearTotals = chartDataMonth.reduce(
    (acc, day) => ({
      tipsMdl: acc.tipsMdl + day.tipsMdl,
      tipsChips: acc.tipsChips + day.tipsChips,
      tipsTotal: acc.tipsTotal + day.tipsTotal,
      resultTips: acc.resultTips + day.resultTips,
    }),
    { tipsMdl: 0, tipsChips: 0, tipsTotal: 0, resultTips: 0 },
  );

  const chartDataYear: ChartDataItem[] = [
    {
      name: monthData?.id ?? "",
      tipsMdl: parseFloat(yearTotals.tipsMdl.toFixed(0)),
      tipsChips: parseFloat(yearTotals.tipsChips.toFixed(0)),
      tipsTotal: parseFloat(yearTotals.tipsTotal.toFixed(0)),
      resultTips: parseFloat(yearTotals.resultTips.toFixed(0)),
    },
  ];

  const chartDataEmployee: ChartDataItem[] = (() => {
    const employeeMap = new Map<string, ChartDataItem>();

    (monthData?.tipsAdd ?? []).forEach((day) => {
      const currency = parseFloat(day.currency);

      day.tipsAdd.forEach((employee) => {
        const name = employee.employeeName.trim();

        if (!employeeMap.has(name)) {
          employeeMap.set(name, {
            name: name.split(" ")[0],
            tipsMdl: 0,
            tipsChips: 0,
            tipsTotal: 0,
            resultTips: 0,
          });
        }

        const entry = employeeMap.get(name)!;

        employee.amount.forEach((a) => {
          const val = parseFloat(a.value);
          if (a.typeAmount === "mdl") {
            entry.tipsMdl += val;
          } else if (a.typeAmount === "chips") {
            entry.tipsChips += val * currency;
          }
        });

        employee.resultAmount.forEach((r) => {
          entry.resultTips += r.value;
        });

        entry.tipsTotal = entry.tipsMdl + entry.tipsChips;
      });
    });

    return Array.from(employeeMap.values()).map((e) => ({
      ...e,
      tipsMdl: parseFloat(e.tipsMdl.toFixed(0)),
      tipsChips: parseFloat(e.tipsChips.toFixed(0)),
      tipsTotal: parseFloat(e.tipsTotal.toFixed(0)),
      resultTips: parseFloat(e.resultTips.toFixed(0)),
    }));
  })();

  const chartData =
    tab === "tips-month"
      ? chartDataMonth
      : tab === "tips-employees"
        ? chartDataEmployee
        : chartDataYear;

  const BAR_KEYS: BarItem[] = [
    { key: "tipsMdl", color: "var(--color-bl)", label: "mdl" },
    { key: "tipsChips", color: "var(--color-gn)", label: "chips" },
    { key: "tipsTotal", color: "var(--color-black)", label: "total" },
    { key: "resultTips", color: "var(--color-rd)", label: "result" },
  ] as const;

  const toggleBar = (key: BarKey) => {
    setVisibleBars((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <CustomChart
        chartData={chartData}
        barItem={BAR_KEYS.filter(({ key }) => visibleBars[key as BarKey])}
        disableTooltip={!isAdmin}
        disableYAxis={!isAdmin}
      />

      <CustomLegend
        items={BAR_KEYS}
        visibleItems={visibleBars}
        onToggle={toggleBar}
      />
    </>
  );
}
