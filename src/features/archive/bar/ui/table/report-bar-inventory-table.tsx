import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GetReportData } from "@/features/report-bar/model/type";
import { useMonthDays } from "@/hooks/use-month-days";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function ReportBarInventoryTable({
  data,
}: {
  data: GetReportData[] | null;
}) {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const { monthDays } = useMonthDays();
  const days = monthDays.map((d) => d.day);

  const inventoryData = data?.map((item) => ({
    id: item.id,
    reportInventory: item.report.inventory,
  }));

  const products = [
    ...new Set(
      inventoryData?.flatMap((item) =>
        item.reportInventory.map((product) => product.name),
      ) ?? [],
    ),
  ];

  function getInventory(day: number, productName: string) {
    const report = inventoryData?.find((item) => item.id === String(day));

    return report?.reportInventory.find(
      (product) => product.name === productName,
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-muted-foreground p-4 text-sm">
        Нет данных по инвентаризации
      </div>
    );
  }

  return (
    <Table className="mt-8 table-auto">
      <TableHeader>
        <TableRow>
          <TableHead />
          <TableHead className="bg-background sticky left-0 z-10 w-40 truncate pr-1 pl-2 text-xs">
            Продукт
          </TableHead>

          {days.map((day) => (
            <TableHead
              key={day}
              className="text-bl w-8.5 border-0 p-0 text-center text-xs"
            >
              {day}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {products.map((product, i) => (
          <TableRow
            key={product}
            onClick={() =>
              setSelectedProduct((prev) => (prev === product ? null : product))
            }
            className={cn(
              "group cursor-pointer",
              "[&>td]:px-1 [&>td]:py-2.5 [&>td]:text-xs [&>td]:transition-colors",
              "hover:[&>td]:bg-muted",
              selectedProduct === product &&
                "[&>td]:text-rd [&>td]:bg-accent [&>td]:font-semibold",
            )}
          >
            <TableCell className="text-rd w-6 text-[11px]!">{i + 1}</TableCell>

            <TableCell className="bg-background group-hover:text-gn sticky left-0 z-10 w-40 truncate pr-1 pl-2">
              {product}
            </TableCell>

            {days.map((day) => {
              const inventory = getInventory(day, product);

              return (
                <TableCell
                  key={day}
                  className={cn("text-gr w-12.5 border-x text-center text-xs")}
                >
                  {inventory?.quantity ?? ""}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
