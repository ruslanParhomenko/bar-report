import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { GetBreakData } from "@/features/break/model/type";
import { useMonthDays } from "@/hooks/use-month-days";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function BreakTableArchive({ data }: { data: GetBreakData[] }) {
  console.log(data);

  const uniqName = [
    ...new Set(
      data?.flatMap((item) =>
        item.rows.flatMap((row) => row.name.trim()).filter(Boolean),
      ) ?? [],
    ),
  ].sort((a, b) => a.localeCompare(b, "ru"));

  console.log("uniqName", uniqName);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const { monthDays } = useMonthDays();
  const days = monthDays.map((d) => d.day);

  function getQuantityBreak(day: number, rowName: string) {
    const reportByDay = data?.find((item) => item.id === String(day));

    const reportDayByName = reportByDay?.rows.find(
      (row) => row.name === rowName,
    );

    return {
      quantity:
        reportDayByName?.hours.reduce(
          (acc, hour) => (["00", "20", "40"].includes(hour) ? acc + 1 : acc),
          0,
        ) || 0,
      id: reportDayByName?.id || "",
    };
  }

  return (
    <Table className="mt-8 table-auto">
      <TableHeader>
        <TableRow>
          <TableHead />
          <TableHead className="bg-background sticky left-0 z-10 w-40 truncate pr-1 pl-2 text-xs">
            employee
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
        {uniqName.map((emp, i) => (
          <TableRow
            key={`${emp}-${i}`}
            onClick={() =>
              setSelectedProduct((prev) => (prev === emp ? null : emp))
            }
            className={cn(
              "group cursor-pointer",
              "[&>td]:px-1 [&>td]:text-xs [&>td]:transition-colors",
              "hover:[&>td]:bg-muted",
              selectedProduct === emp &&
                "[&>td]:text-rd [&>td]:bg-accent [&>td]:font-semibold",
            )}
          >
            <TableCell className="text-rd w-6 text-[11px]!">{i + 1}</TableCell>

            <TableCell className="bg-background group-hover:text-gn sticky left-0 z-10 w-40 truncate pr-1 pl-2">
              {emp}
            </TableCell>

            {days.map((day) => {
              const quantityBreak = getQuantityBreak(day, emp);

              return (
                <TableCell
                  key={day}
                  className={cn(
                    "w-12.5 border-x py-0 text-center text-xs",
                    quantityBreak.quantity > 5 ? "bg-rd/30" : "",
                  )}
                >
                  <div className={cn("flex flex-col")}>
                    <span className={cn("text-bl text-center text-xs")}>
                      {quantityBreak.quantity != 0 && quantityBreak?.quantity}
                    </span>
                    <span className="text-gr text-[9px]">
                      {quantityBreak?.id ?? ""}
                    </span>
                  </div>
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
