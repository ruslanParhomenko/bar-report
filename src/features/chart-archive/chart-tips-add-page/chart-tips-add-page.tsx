"use client";
import { GetTipsAddByYear } from "@/app/actions/tips-add/tips-add-actions";
import CustomChart from "@/components/chart/custom-chart";
import CustomLegend from "@/components/chart/custom-legend";
import {
  MonthPicker,
  MonthRange,
} from "@/components/input-controlled/month-range";
import { cn } from "@/lib/utils";
import { useAbility } from "@/providers/ability-provider";
import { useMonthDays } from "@/providers/month-days-provider";
import { MONTHS } from "@/utils/get-month-days";
import { TrashIcon } from "lucide-react";
import { useMemo, useState } from "react";

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
  const { isAdmin, isManager, isUser } = useAbility();
  const canSeeAll = isAdmin || isManager || isUser;

  const { month } = useMonthDays();

  const [visibleBars, setVisibleBars] = useState<Record<BarKey, boolean>>({
    tipsMdl: false,
    tipsChips: false,
    tipsTotal: false,
    resultTips: true,
  });
  const [range, setRange] = useState<MonthRange>();
  const [activeName, setActiveName] = useState<string>("");

  const monthData = dataTipsAdd?.find((data) => data.id === month) || null;
  const getMonthIndex = (id: string) => MONTHS.indexOf(id);

  // chart data for year view

  const dataTipsPrevMonth = useMemo(() => {
    if (range?.from === undefined || range?.to === undefined) {
      return dataTipsAdd;
    }

    const from = range.from;
    const to = range.to;

    return dataTipsAdd?.filter((data) => {
      const idx = getMonthIndex(data.id);
      return idx >= from && idx <= to;
    });
  }, [range, dataTipsAdd]);

  // chart data by employee for month view

  const uniqueEmployees = useMemo(() => {
    const employeeSet = new Set<string>();
    const dataTipsAllDay = dataTipsAdd.flatMap((month) =>
      month.tipsAdd.flatMap((day) => day.tipsAdd),
    );
    dataTipsAllDay.forEach((employee) => {
      employeeSet.add(employee.employeeName.trim());
    });
    return Array.from(employeeSet);
  }, [monthData]);

  // chart data by employee for year view

  const chartDataByEmployee: ChartDataItem[] = !activeName
    ? []
    : MONTHS.map((monthId) => {
        const monthData = dataTipsAdd?.find((m) => m.id === monthId);

        let tipsMdl = 0;
        let tipsChips = 0;
        let resultTips = 0;

        (monthData?.tipsAdd ?? []).forEach((day) => {
          const currency = parseFloat(day.currency);

          day.tipsAdd
            .filter((employee) => employee.employeeName.trim() === activeName)
            .forEach((employee) => {
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
        });

        const tipsTotal = tipsMdl + tipsChips;

        return {
          name: monthId,
          tipsMdl: parseFloat(tipsMdl.toFixed(0)),
          tipsChips: parseFloat(tipsChips.toFixed(0)),
          tipsTotal: parseFloat(tipsTotal.toFixed(0)),
          resultTips: parseFloat(resultTips.toFixed(0)),
        };
      });

  // chart data for month view
  const chartDataTipsByDay: ChartDataItem[] = (monthData?.tipsAdd ?? [])
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

  const chartDataYear: ChartDataItem[] = (() => {
    const employeeMap = new Map<string, ChartDataItem>();

    (dataTipsPrevMonth ?? []).forEach((monthData) => {
      (monthData.tipsAdd ?? []).forEach((day) => {
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
    });

    return Array.from(employeeMap.values()).map((e) => ({
      ...e,
      tipsMdl: parseFloat(e.tipsMdl.toFixed(0)),
      tipsChips: parseFloat(e.tipsChips.toFixed(0)),
      tipsTotal: parseFloat(e.tipsTotal.toFixed(0)),
      resultTips: parseFloat(e.resultTips.toFixed(0)),
    }));
  })();

  const CHART_DATA_MAP: Record<string, ChartDataItem[]> = {
    "tips-day": chartDataTipsByDay,
    "tips-year": chartDataYear,
    "tips-employee": chartDataByEmployee,
  };

  const chartData = CHART_DATA_MAP[tab];

  const BAR_KEYS: BarItem[] = [
    { key: "tipsMdl", color: "var(--color-bl)", label: "mdl" },
    { key: "tipsChips", color: "var(--color-gn)", label: "chips" },
    { key: "tipsTotal", color: "var(--color-black)", label: "total" },
    { key: "resultTips", color: "var(--color-rd)", label: "result" },
  ] as const;

  const toggleBar = (key: BarKey) => {
    setVisibleBars((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!canSeeAll) {
    return (
      <div className="text-rd flex h-full items-center justify-center">
        no permissions
      </div>
    );
  }

  return (
    <>
      {tab === "tips-year" && (
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
        barItem={BAR_KEYS.filter(({ key }) => visibleBars[key as BarKey])}
        className={cn(
          tab === "tips-year" || tab === "tips-employee"
            ? "h-[70dvh]"
            : "h-[77dvh]",
        )}
        disableTooltip={!isAdmin}
        disableYAxis={!isAdmin}
        vertical={tab === "tips-year"}
      />

      <CustomLegend
        items={BAR_KEYS}
        visibleItems={visibleBars}
        onToggle={toggleBar}
      />
      <div className="flex flex-wrap justify-center gap-1 md:px-4 md:pb-2">
        {tab === "tips-employee" &&
          uniqueEmployees.map((name) => (
            <span
              key={name}
              onClick={() =>
                setActiveName((prev) => (prev === name ? "" : name))
              }
              className={cn(
                "cursor-pointer rounded-full px-1 py-1 text-xs transition-opacity md:px-3",
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
