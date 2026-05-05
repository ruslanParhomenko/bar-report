"use client";
import { CreateDataTTN } from "@/app/actions/data-constants/data-ttn-action";
import { GetTTNData } from "@/app/actions/ttn/ttn-actions";
import {
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useMonthDays } from "@/providers/month-days-provider";
import { MONTHS } from "@/utils/get-month-days";
import { useState } from "react";

export default function TtnYearPage({
  data,
  agentTTN,
}: {
  data: GetTTNData[] | null;
  agentTTN: CreateDataTTN["agent"];
}) {
  const { year } = useMonthDays();

  const todayMonth = MONTHS[new Date().getMonth() + 1];
  const [selectedMonth, setSelectedMonth] = useState<string>(todayMonth);
  const [itemSearch, setItemSearch] = useState<string>("");
  const normalizedSearch = itemSearch.trim().toLowerCase();

  const cellCn = "border-x text-xs";

  // считаем данные по всем агентам
  const allAgentData = agentTTN.map((agent) => {
    const agentMonthData = MONTHS.map((month) => {
      const monthData = data?.find((d) => d.id === month);
      const supplierData = monthData?.ttnData?.rowSuppliers?.[agent];
      if (!supplierData) return { month, minus: 0, plus: 0, final: 0 };

      const minus = (supplierData.minus ?? []).reduce(
        (acc, v) => acc + (Number(v) || 0),
        0,
      );
      const plus = (supplierData.plus ?? []).reduce(
        (acc, v) => acc + (Number(v) || 0),
        0,
      );
      return { month, minus, plus, final: plus + minus };
    });

    const totalMinus = agentMonthData.reduce((acc, d) => acc + d.minus, 0);
    const totalPlus = agentMonthData.reduce((acc, d) => acc + d.plus, 0);
    const finalBalance = totalPlus + totalMinus;

    return { agent, agentMonthData, totalMinus, totalPlus, finalBalance };
  });

  // итого для footer
  const footerTotalMinus = allAgentData.reduce(
    (acc, d) => acc + d.totalMinus,
    0,
  );
  const footerTotalPlus = allAgentData.reduce((acc, d) => acc + d.totalPlus, 0);
  const footerFinalBalance = allAgentData.reduce(
    (acc, d) => acc + d.finalBalance,
    0,
  );

  const footerMonthTotals = MONTHS.map((month) => {
    const minus = allAgentData.reduce((acc, d) => {
      const m = d.agentMonthData.find((md) => md.month === month);
      return acc + (m?.minus ?? 0);
    }, 0);
    const plus = allAgentData.reduce((acc, d) => {
      const m = d.agentMonthData.find((md) => md.month === month);
      return acc + (m?.plus ?? 0);
    }, 0);
    return { month, minus, plus };
  });

  const filtered = allAgentData.filter(({ agent }) =>
    normalizedSearch ? agent.toLowerCase().includes(normalizedSearch) : true,
  );

  return (
    <table className="w-full text-xs">
      <TableHeader className="bg-background sticky top-0 left-0 z-12">
        <TableRow className="[&>td]:py-0">
          <TableCell className={cn(cellCn, "w-22 text-center font-bold")}>
            {year || ""}
          </TableCell>
          <TableCell className={cn(cellCn, "w-22")}>
            <input
              type="text"
              placeholder="...search"
              onChange={(e) => setItemSearch(e.target.value)}
              className="w-16 p-1 text-xs outline-none focus:ring-0 focus:outline-none focus-visible:ring-0"
            />
          </TableCell>
          <TableCell className={cn(cellCn)} />
          {MONTHS.map((month) => (
            <TableCell
              key={month}
              className={cn(
                cellCn,
                "w-30 cursor-pointer text-center font-bold",
                selectedMonth === month && "bg-muted/40",
              )}
              onClick={() => setSelectedMonth(month)}
            >
              {month.slice(0, 3)}
            </TableCell>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {filtered.map(
          ({ agent, agentMonthData, totalMinus, totalPlus, finalBalance }) => (
            <TableRow key={agent} className="group [&>td]:py-0 [&>td]:text-xs">
              <TableCell className="w-18 border-r px-4">
                <div className="flex flex-col items-end">
                  <span
                    className={cn(
                      "text-rd",
                      totalMinus === 0 && "text-muted-foreground",
                    )}
                  >
                    {totalMinus.toFixed(2)}
                  </span>
                  <span
                    className={cn(
                      "text-bl",
                      totalPlus === 0 && "text-muted-foreground",
                    )}
                  >
                    {totalPlus.toFixed(2)}
                  </span>
                </div>
              </TableCell>

              <TableCell
                className={cn(
                  cellCn,
                  "bg-background sticky left-0 font-medium md:bg-transparent",
                )}
              >
                {agent}
              </TableCell>

              <TableCell
                className={cn(
                  cellCn,
                  finalBalance < 0 ? "text-rd" : "text-bl",
                  "w-16 text-right font-bold",
                )}
              >
                {finalBalance.toFixed(2)}
              </TableCell>

              {agentMonthData.map(({ month, minus, plus }) => (
                <TableCell
                  key={month}
                  className={cn(
                    cellCn,
                    "w-22",
                    selectedMonth === month && "bg-muted/40",
                  )}
                >
                  <div className="flex flex-col items-end">
                    <span className={cn("text-rd", minus === 0 && "opacity-0")}>
                      {minus !== 0 ? minus.toFixed(2) : ""}
                    </span>
                    <span className={cn("text-bl", plus === 0 && "opacity-0")}>
                      {plus !== 0 ? plus.toFixed(2) : ""}
                    </span>
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ),
        )}
      </TableBody>

      <TableFooter className="bg-background sticky bottom-0 z-12">
        <TableRow className="[&>td]:py-0">
          <TableCell className={cn(cellCn, "w-30")}>
            <div className="flex flex-col items-end font-bold">
              <span className="text-rd">{footerTotalMinus.toFixed(2)}</span>
              <span className="text-bl">{footerTotalPlus.toFixed(2)}</span>
            </div>
          </TableCell>

          <TableCell className={cn(cellCn)} />

          <TableCell
            className={cn(
              cellCn,
              footerFinalBalance < 0 ? "text-rd" : "text-bl",
              "text-right font-bold",
            )}
          >
            {footerFinalBalance.toFixed(2)}
          </TableCell>

          {footerMonthTotals.map(({ month, minus, plus }) => (
            <TableCell
              key={month}
              className={cn(
                cellCn,
                "w-30",
                selectedMonth === month && "bg-muted/40",
              )}
            >
              <div className="flex flex-col items-end font-bold">
                <span className={cn("text-rd", minus === 0 && "opacity-0")}>
                  {minus !== 0 ? minus.toFixed(2) : ""}
                </span>
                <span className={cn("text-bl", plus === 0 && "opacity-0")}>
                  {plus !== 0 ? plus.toFixed(2) : ""}
                </span>
              </div>
            </TableCell>
          ))}
        </TableRow>
      </TableFooter>
    </table>
  );
}
