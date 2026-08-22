"use client";

import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";

import CustomChart from "@/components/chart/custom-chart";
import { parseOrdersByHourOfDay, type HourBucket } from "@/lib/parse-xls";
import { cn } from "@/lib/utils";

type ChartDataItem = { name: string; value: number };
type BarKey = keyof Omit<ChartDataItem, "name">;
type BarItem = { key: BarKey; color: string; visible: boolean };

const BAR_KEYS: BarItem[] = [
  { key: "value", color: "var(--color-gn)", visible: true },
];

export default function OrdersByHourPage() {
  const [result, setResult] = useState<HourBucket[]>([]);
  const [fileName, setFileName] = useState("Выберите файлы");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files?.length) return;

    const buffers = await Promise.all(
      Array.from(files).map((file) => file.arrayBuffer()),
    );

    const data = parseOrdersByHourOfDay(buffers);

    console.log(data);

    setResult(data);

    setFileName(
      Array.from(files)
        .map((file) => file.name)
        .join(" + "),
    );
  };

  return (
    <div className="flex flex-col md:h-[90dvh]">
      <div className="bg-background sticky top-0 z-9 flex w-full items-center justify-between py-4">
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
        <div className="w-full text-center text-xs">Заказы по часам</div>
      </div>

      <CustomChart
        chartData={result as ChartDataItem[]}
        barItem={BAR_KEYS}
        className={cn("w-full! md:min-h-0 md:flex-1")}
      />
    </div>
  );
}
