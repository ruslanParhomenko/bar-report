"use client";

import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";

import CustomChart from "@/components/chart/custom-chart";
import NavTabs from "@/components/nav-tabs/nav-tabs";
import { Button } from "@/components/ui/button";
import { DailyIssueChart } from "@/features/parser-1c/xls-parser/daily-issue-chart";
import {
  parseOrdersByHourOfDay,
  parseSales,
  SaleRow,
  type HourBucket,
} from "@/lib/parse-xls";
import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";

type ChartDataItem = { name: string; value: number };
type BarKey = keyof Omit<ChartDataItem, "name">;
type BarItem = { key: BarKey; color: string; visible: boolean };

const BAR_KEYS: BarItem[] = [
  { key: "value", color: "var(--color-gn)", visible: true },
];
const NAV_ITEMS = ["peak order hours", "product issue time"] as const;

export type SaleByDay = {
  name: string;
  value: number;
  day: string;
  times: string[];
};

function parseSalesByDay(sales: SaleRow[]): SaleByDay[] {
  const grouped = new Map<string, string[]>();

  for (const sale of sales) {
    const times = grouped.get(sale.day) ?? [];
    times.push(sale.time);
    grouped.set(sale.day, times);
  }

  return Array.from(grouped.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, times]) => ({
      day,
      name: day.slice(8, 10),
      value: times.length,
      times: times.sort((a, b) => a.localeCompare(b)),
    }));
}

export default function OrdersByHourPage() {
  const [selectedTab, setSelectedTab] =
    useState<(typeof NAV_ITEMS)[number]>("peak order hours");

  const [result, setResult] = useState<HourBucket[]>([]);
  const [salesResult, setSalesResult] = useState<SaleRow[]>([]);
  const [salesUniqNames, setSalesUniqNames] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState<string>("");

  const [searchInput, setSearchInput] = useState<string>("");

  const [fileName, setFileName] = useState("Выберите файлы");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files?.length) return;

    const buffers = await Promise.all(
      Array.from(files).map((file) => file.arrayBuffer()),
    );

    const data = parseOrdersByHourOfDay(buffers);

    const salesData = parseSales(buffers);

    setResult(data);
    setSalesResult(salesData.result);
    setSalesUniqNames(salesData.uniqName);

    setFileName(
      Array.from(files)
        .map((file) => file.name)
        .join(" + "),
    );
  };

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab as (typeof NAV_ITEMS)[number]);
  };

  const chartData = {
    "peak order hours": result,
    "product issue time": salesResult.filter(
      (item) => activeItem === "all" || item.name === activeItem,
    ),
  };

  const chartDataByTab = chartData[selectedTab];

  const filteredSales = salesResult.filter((item) => item.name === activeItem);

  const dailySalesData = parseSalesByDay(filteredSales);

  return (
    <div className="flex flex-col md:h-[90dvh]">
      <div className="bg-background sticky top-0 z-9 grid grid-cols-[40%_60%] py-4">
        <div
          className="flex w-80 cursor-pointer items-center justify-center"
          onClick={() => inputRef.current?.click()}
        >
          <Input
            ref={inputRef}
            type="file"
            accept=".xls"
            multiple
            onChange={handleFile}
            className="hidden"
          />
          <span className="text-muted-foreground text-xs">
            {fileName.split("-")[0]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <NavTabs
            navItems={NAV_ITEMS}
            activeTab={selectedTab}
            handleTabChange={handleTabChange}
            classTabs="bg-transparent h-5"
            classTrigger="h-5 border-0 shadow-none!"
            withSelect
          />
        </div>
      </div>

      {selectedTab === "peak order hours" ? (
        <CustomChart
          chartData={result as ChartDataItem[]}
          barItem={BAR_KEYS}
          className={cn("w-full! md:min-h-0 md:flex-1")}
        />
      ) : (
        <div className="min-h-64 w-full flex-1 md:min-h-0">
          <DailyIssueChart data={dailySalesData} />
        </div>
      )}
      {selectedTab === "product issue time" && (
        <div className="flex flex-wrap justify-start gap-1 pb-2 md:px-4 print:hidden">
          {salesUniqNames
            .filter((name) =>
              name
                .toLocaleLowerCase()
                .trim()
                .includes(searchInput.toLocaleLowerCase().trim()),
            )
            .map((name) => (
              <span
                key={name}
                onClick={() => setActiveItem(name)}
                className={cn(
                  "cursor-pointer rounded-full px-1 text-xs leading-3 transition-opacity md:px-3 md:py-1",
                  activeItem !== name && "opacity-35",
                )}
              >
                {name.slice(0, 14)}
              </span>
            ))}
        </div>
      )}

      {selectedTab === "product issue time" && (
        <div className="flex items-center justify-center gap-2 px-4 pb-2 print:hidden">
          <Input
            className="h-6 w-40 text-xs md:h-7 md:text-sm"
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
      )}
    </div>
  );
}
