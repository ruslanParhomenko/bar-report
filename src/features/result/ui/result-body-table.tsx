"use client";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { handleCopy } from "@/utils/handler-copy-text";
import { useResultCalculations } from "../lib/utils";

export default function ResultTableBody({
  rows,
  totals,
  isAdmin,
}: {
  rows: ReturnType<typeof useResultCalculations>["rows"];
  totals: ReturnType<typeof useResultCalculations>["totals"];
  isAdmin: boolean;
}) {
  const isMobile = useIsMobile();

  return (
    <TableBody>
      {rows.map(
        (
          { e, dayH, nightH, totalHours, rate, salary, sendTips, result },
          index,
        ) => (
          <TableRow
            key={index}
            className="hover:text-rd hover:bg-accent [&>td]:text-center [&>td]:text-[11px] md:[&>td]:text-base"
          >
            <TableCell
              className="cursor-copy px-1 text-start! md:px-8"
              onClick={() => handleCopy(e.employee)}
            >
              {isMobile
                ? e.employee.split(" ")[0].slice(0, 7) +
                  ".. " +
                  e.employee.split(" ")[1][0]
                : e.employee}
            </TableCell>
            <TableCell
              className="cursor-copy border-x"
              onClick={() => handleCopy(String(salary))}
            >
              {isAdmin ? salary : "****"}
            </TableCell>
            <TableCell
              className="text-gn cursor-copy"
              onClick={() => handleCopy(String(sendTips))}
            >
              {sendTips}
            </TableCell>
            <TableCell
              className="text-rd cursor-copy"
              onClick={() => handleCopy(String(e.penalty))}
            >
              {e.penalty}
            </TableCell>
            <TableCell
              className="text-bl cursor-copy"
              onClick={() => handleCopy(String(e.bonus))}
            >
              {e.bonus}
            </TableCell>
            <TableCell className="border-x">
              {isMobile ? rate / 1000 : rate}
            </TableCell>

            <TableCell className="border-r p-0">
              <div className="flex items-center justify-center gap-1 md:gap-3">
                <div className="divide-gr/20 flex flex-col items-center justify-center divide-y">
                  <span className="text-[10px] md:text-[11px]">{dayH}</span>
                  <span className="text-[10px] md:text-[11px]">{nightH}</span>
                </div>
                <div className="text-[10px] md:text-[11px]">{totalHours}</div>
              </div>
            </TableCell>

            <TableCell>{isAdmin ? result : "*****"}</TableCell>
          </TableRow>
        ),
      )}

      <TableRow className="h-12 md:font-bold [&>td]:text-center [&>td]:text-[11px] md:[&>td]:text-sm">
        <TableCell />
        <TableCell className="border-x">
          {isAdmin ? totals.salary : "****"}
        </TableCell>
        <TableCell className="text-gn">{totals.sendTips}</TableCell>
        <TableCell className="text-rd">{totals.penalty}</TableCell>
        <TableCell className="text-bl">{totals.bonus}</TableCell>
        <TableCell className="border-x" />

        <TableCell>
          <div className="flex items-center justify-center gap-1 md:gap-3">
            <div className="divide-gr/20 flex flex-col items-center justify-center divide-y">
              <span className="text-[10px] md:text-[11px]">{totals.dayH}</span>
              <span className="text-[10px] md:text-[11px]">
                {totals.nightH}
              </span>
            </div>
            <div className="text-[10px] md:text-[11px]">
              {totals.totalHours}
            </div>
          </div>
        </TableCell>
        <TableCell className="border-l">
          {isAdmin ? totals.result : "*****"}
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
