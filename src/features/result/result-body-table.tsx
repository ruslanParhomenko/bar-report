"use client";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { handleCopy } from "@/utils/handler-copy-text";
import { useResultCalculations } from "./utils";

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
            className="hover:text-rd hover:bg-accent [&>td]:text-center [&>td]:text-xs md:[&>td]:text-sm"
          >
            <TableCell
              className="bg-background sticky left-0 cursor-copy px-0 text-start! md:bg-transparent md:pl-4"
              onClick={() => handleCopy(e.employee)}
            >
              <p className="truncate">{e.employee}</p>
            </TableCell>
            <TableCell className="border-r px-1">
              {isMobile ? rate / 1000 : rate}
            </TableCell>
            <TableCell className="px-0">{dayH}</TableCell>
            <TableCell className="px-0">{nightH}</TableCell>
            <TableCell
              onClick={() => handleCopy(String(totalHours))}
              className="text-gn cursor-copy border-r px-0"
            >
              {totalHours}
            </TableCell>
            <TableCell
              className="cursor-copy border-r px-0 md:pl-6"
              onClick={() => handleCopy(String(salary))}
            >
              {isAdmin ? salary : "****"}
            </TableCell>

            <TableCell
              className="cursor-copy px-0"
              onClick={() => handleCopy(String(sendTips))}
            >
              {sendTips}
            </TableCell>
            <TableCell
              className="text-rd cursor-copy px-0"
              onClick={() => handleCopy(String(e.penalty))}
            >
              {e.penalty}
            </TableCell>
            <TableCell
              className="cursor-copy border-r px-0"
              onClick={() => handleCopy(String(e.bonus))}
            >
              {e.bonus}
            </TableCell>
            {!isMobile && (
              <TableCell
                className="border-r"
                onClick={() => handleCopy(e.employee)}
              >
                {e.employee}
              </TableCell>
            )}
            <TableCell className="px-0">{isAdmin ? result : "*****"}</TableCell>
          </TableRow>
        ),
      )}

      <TableRow className="text-bl font-bold [&>td]:px-0 [&>td]:text-center [&>td]:text-xs md:[&>td]:text-sm">
        <TableCell />
        <TableCell />
        <TableCell>{totals.dayH}</TableCell>
        <TableCell>{totals.nightH}</TableCell>
        <TableCell>{totals.totalHours}</TableCell>
        <TableCell>{isAdmin ? totals.salary : "****"}</TableCell>
        <TableCell>{totals.sendTips}</TableCell>
        <TableCell>{totals.penalty}</TableCell>
        <TableCell>{totals.bonus}</TableCell>
        {!isMobile && <TableCell />}
        <TableCell>{isAdmin ? totals.result : "*****"}</TableCell>
      </TableRow>
    </TableBody>
  );
}
