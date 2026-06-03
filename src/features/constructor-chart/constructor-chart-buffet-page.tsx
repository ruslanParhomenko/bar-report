"use client";
import { GetBuffetData } from "@/app/actions/data-constants/data-buffet-action";
import CustomChart from "@/components/chart/custom-chart";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { getUniqueProductNames } from "./utils";

type ChartDataItem = {
  name: string;
  value: number;
};
type BarKey = keyof Omit<ChartDataItem, "name">;

type BarItem = {
  key: BarKey;
  color: string;
  label: string;
};

export default function ConstructorChartBuffetPage({
  data,
}: {
  data: GetBuffetData["data"];
}) {
  const uniqueNames = getUniqueProductNames(data);

  const [filters, setFilters] = useState<"month" | "product">("month");

  const BAR_KEYS: BarItem[] = [
    {
      key: "value",
      color: "var(--color-gn)",
      label: "value",
    },
  ];

  const getWeekDayShort = (dateStr: string) => {
    const days = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
    const date = new Date(dateStr);
    return days[date.getDay()];
  };

  const chartDataMonth = data.map((item) => ({
    name: `${getWeekDayShort(item.id)}-${item.id.split("-")[2]}`,
    value: Number(
      item.product
        .reduce(
          (sum, product) =>
            sum +
            (product.weight === "kg"
              ? product.value || 0
              : (product?.value || 0) * 0.15),
          0,
        )
        .toFixed(0),
    ),
  }));

  const chartDataProduct = uniqueNames.map((name) => ({
    name: name as string,
    value: Number(
      data
        .flatMap((item) => item.product)
        .filter((product) => product.name === name)
        .reduce(
          (sum, product) =>
            sum +
            (product.weight === "kg"
              ? product.value || 0
              : (product?.value || 0) * 0.15),
          0,
        )
        .toFixed(0),
    ),
  }));

  const chartData =
    filters === "month"
      ? chartDataMonth
      : chartDataProduct.filter((item) => item.value > 0);

  return (
    <>
      <div className="flex items-center justify-start gap-4 px-4">
        <Switch
          id="chart-filter"
          checked={filters === "product"}
          onCheckedChange={(checked) =>
            setFilters(checked ? "product" : "month")
          }
          className="shadow-none"
        />
        <Label className="text-muted-foreground text-xs">{filters}</Label>
      </div>
      <CustomChart
        chartData={chartData}
        barItem={BAR_KEYS}
        className="h-[70dvh]"
        vertical
      />
    </>
  );
}
