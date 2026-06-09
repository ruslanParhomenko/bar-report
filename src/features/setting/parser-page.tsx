"use client";

import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";

import CustomChart from "@/components/chart/custom-chart";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { parseExp } from "./utils";

type ChartDataItem = { name: string; value: number };
type BarKey = keyof Omit<ChartDataItem, "name">;
type BarItem = { key: BarKey; color: string; label: string };

const CELESTA_TABS = [
  "ПЛАТНО",
  "Reception",
  "Pit FM",
  "FREE (clients)",
  "Admin",
  "Furset",
  "Office",
  "Staff питание",
  "STATUS",
  "Staff - Furset",
  "Списать",
  "VIP FREE",
] as const;

const DEFAULT_TAB = "Furset";

interface SaleItem {
  id: number;
  date: string;
  item: string;
  quantity: number;
  price: number;
  client: string;
}

export default function ParserPage() {
  const [result, setResult] = useState<SaleItem[]>([]);

  const [fileName, setFileName] = useState("Выберите файл");
  const inputRef = useRef<HTMLInputElement>(null);

  const [filters, setFilters] = useState<"month" | "product">("month");
  const [activeTab, setActiveTab] = useState<string>(DEFAULT_TAB);

  const BAR_KEYS: BarItem[] = [
    { key: "value", color: "var(--color-gn)", label: "value" },
  ];

  const getWeekDayShort = (dateStr: string) => {
    const days = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
    return days[new Date(dateStr).getDay()];
  };

  const filteredData = result.filter((item) => item.client == activeTab);

  const chartDataMonth = Object.values(
    filteredData.reduce(
      (acc, item) => {
        const date = item.date;
        if (!acc[date]) {
          const d = new Date(date);
          acc[date] = {
            name: `${getWeekDayShort(date)}-${d.getDate()}`,
            value: 0,
            date,
          };
        }
        acc[date].value += item.quantity;
        return acc;
      },
      {} as Record<string, { name: string; value: number; date: string }>,
    ),
  ).map((item) => ({
    ...item,
    value: Number(item.value.toFixed(0)),
  }));

  const chartDataProduct = Array.from(
    filteredData.reduce((acc, item) => {
      acc.set(
        item.item,
        (acc.get(item.item) || 0) + Number(item.quantity.toFixed(0)),
      );
      return acc;
    }, new Map<string, number>()),
  ).map(([name, value]) => ({ name, value: Number(value.toFixed(0)) }));

  const chartData =
    filters === "month"
      ? chartDataMonth
      : chartDataProduct.filter((i) => i.value > 0);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const buffer = await file.arrayBuffer();

    const text = new TextDecoder("windows-1251").decode(buffer);

    const data = parseExp(text);

    setResult(data);

    setFileName(file.name);
  };

  return (
    <>
      <>
        <div className="bg-background sticky top-0 z-10 flex px-4 pb-2">
          <div
            className="flex h-10 cursor-pointer items-center gap-2 px-6"
            onClick={() => inputRef.current?.click()}
          >
            <Input
              ref={inputRef}
              type="file"
              accept=".exp"
              onChange={handleFile}
              className="hidden"
            />

            <span className="text-muted-foreground text-sm">{fileName}</span>
          </div>
          <ToggleGroup
            type="single"
            value={activeTab}
            onValueChange={(val) => val && setActiveTab(val)}
            className="flex flex-wrap justify-start gap-3"
          >
            {CELESTA_TABS.map((tab) => (
              <ToggleGroupItem
                key={tab}
                value={tab}
                variant="outline"
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground h-7 rounded-full px-3 text-xs"
              >
                {tab}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

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
          className="h-[82dvh] w-full!"
          vertical
        />
      </>
    </>
  );
}
