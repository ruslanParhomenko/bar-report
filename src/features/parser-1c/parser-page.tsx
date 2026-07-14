"use client";

import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";

import CustomChart from "@/components/chart/custom-chart";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";
import { parseExp } from "../setting/utils";

type ChartDataItem = { name: string; value: number };
type BarKey = keyof Omit<ChartDataItem, "name">;
type BarItem = { key: BarKey; color: string; label: string };

const CELESTA_TABS = [
  "ПЛАТНО",
  "Reception",
  "Pit FM",
  "FREE (clients)",
  "Admin",
  "Bar - Furset",
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
  const isMobile = useIsMobile();

  const [result, setResult] = useState<SaleItem[]>([]);
  const [activeItem, setActiveItem] = useState<string>("all");

  const [fileName, setFileName] = useState("Выберите файл");
  const inputRef = useRef<HTMLInputElement>(null);

  const [filters, setFilters] = useState<"month" | "product">("month");
  const [searchInput, setSearchInput] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>(DEFAULT_TAB);

  const BAR_KEYS: BarItem[] = [
    { key: "value", color: "var(--color-gn)", label: "value" },
  ];

  const getWeekDayShort = (dateStr: string) => {
    const days = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
    return days[new Date(dateStr).getDay()];
  };

  const filteredData = result.filter((item) => item.client == activeTab);

  const uniqueName = [...new Set(filteredData.map((item) => item.item)), "all"];

  const chartDataMonth = Object.values(
    filteredData
      .filter((item) => activeItem === "all" || item.item === activeItem)
      .reduce(
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
    value: Number(item.value.toFixed(2)),
  }));

  const chartDataProduct = Array.from(
    filteredData.reduce((acc, item) => {
      acc.set(
        item.item,
        (acc.get(item.item) || 0) + Number(item.quantity.toFixed(2)),
      );
      return acc;
    }, new Map<string, number>()),
  ).map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }));

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
    <div className="flex flex-col md:h-[90dvh]">
      <div className="bg-background w-ful sticky top-0 z-10 grid grid-cols-1 gap-3 pb-1 md:grid-cols-[30%_auto] md:px-4 md:pb-2 print:hidden">
        <div className="flex w-full items-center justify-center gap-4 md:justify-start">
          <div
            className="flex w-full cursor-pointer items-center justify-center px-6"
            onClick={() => inputRef.current?.click()}
          >
            <Input
              ref={inputRef}
              type="file"
              accept=".exp"
              onChange={handleFile}
              className="hidden"
            />
            <span className="text-muted-foreground w-30 text-xs md:text-sm">
              {fileName.split("-")[0]}
            </span>
          </div>
          <div className="flex w-full items-center justify-center gap-4">
            <Switch
              id="chart-filter"
              checked={filters === "product"}
              onCheckedChange={(checked) =>
                setFilters(checked ? "product" : "month")
              }
              className="shadow-none"
            />
            <Label className="text-muted-foreground w-20 text-xs">
              {filters}
            </Label>
          </div>
        </div>
        <div>
          <ToggleGroup
            type="single"
            value={activeTab}
            onValueChange={(val) => {
              if (val) {
                setActiveTab(val);
                setActiveItem("all");
              }
            }}
            className="flex flex-wrap items-center justify-center gap-1 md:justify-start md:gap-3"
          >
            {CELESTA_TABS.map((tab) => (
              <ToggleGroupItem
                key={tab}
                value={tab}
                variant="outline"
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground h-6 rounded-full p-1.5 text-xs md:h-7 md:px-3"
              >
                {isMobile ? tab.slice(0, 6) : tab}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>
      <Label className="block w-full text-center text-xs">{activeItem}</Label>

      <CustomChart
        chartData={chartData}
        barItem={BAR_KEYS}
        className={cn("w-full! md:min-h-0 md:flex-1")}
        vertical
      />

      {filters === "month" && (
        <div className="flex flex-wrap justify-start gap-1 pb-2 md:px-4 print:hidden">
          {uniqueName
            .filter((name) => name.includes(searchInput))
            .map((name) => (
              <span
                key={name}
                onClick={() => setActiveItem(name)}
                className={cn(
                  "cursor-pointer rounded-full px-1 text-xs transition-opacity md:px-3 md:py-1",
                  activeItem !== name && "opacity-35",
                )}
              >
                {isMobile ? name.slice(0, 14) : name}
              </span>
            ))}
        </div>
      )}
      <div className="flex items-center justify-center gap-1 px-4 pb-2 print:hidden">
        <Input
          className="h-6 w-40 text-xs md:h-7 md:text-base"
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search..."
        />
        {searchInput && (
          <Button
            onClick={() => setSearchInput("")}
            variant="destructive"
            className="h-6"
          >
            <Trash className="h-2 w-2 text-white" />
          </Button>
        )}
      </div>
    </div>
  );
}
