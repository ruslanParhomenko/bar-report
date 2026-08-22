"use client";

import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";

import CustomChart from "@/components/chart/custom-chart";
import { Label } from "@/components/ui/label";
import { parseOrdersToHourlyJson, type HourBucket } from "@/lib/parse-xls";
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

    if (!files || files.length === 0) return;

    const buffers = await Promise.all(
      Array.from(files).map((file) => file.arrayBuffer()),
    );

    const data = parseOrdersToHourlyJson(buffers);

    setResult(data);

    setFileName(
      Array.from(files)
        .map((f) => f.name)
        .join(" + "),
    );
  };

  return (
    <div className="flex flex-col md:h-[90dvh]">
      <div className="bg-background w-ful sticky top-0 z-10 flex items-center justify-between gap-3 pt-4 pb-1 md:px-4 md:pb-2">
        <div
          className="flex w-1/2 cursor-pointer items-center justify-center"
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
        <Label className="block w-full text-center text-xs">
          Заказы по часам
        </Label>
      </div>

      <CustomChart
        chartData={result as ChartDataItem[]}
        barItem={BAR_KEYS}
        className={cn("w-full! md:min-h-0 md:flex-1")}
      />
    </div>
  );
}
