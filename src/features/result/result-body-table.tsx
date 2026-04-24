"use client";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useAbility } from "@/providers/ability-provider";
import { handleCopy } from "@/utils/handler-copy-text";
import { useResultCalculations } from "./utils";

export default function ResultTableBody({
  rows,
  totals,
}: {
  rows: ReturnType<typeof useResultCalculations>["rows"];
  totals: ReturnType<typeof useResultCalculations>["totals"];
}) {
  const { isAdmin } = useAbility();
  return (
    <TableBody>
      {rows.map(
        (
          { e, dayH, nightH, totalHours, rate, salary, sendTips, result },
          index,
        ) => (
          <TableRow key={index}>
            <TableCell
              className="bg-background sticky left-0 cursor-copy"
              onClick={() => handleCopy(e.employee)}
            >
              {e.employee}
            </TableCell>
            <TableCell className="border-r text-center">
              {Number(rate) / 1000}
            </TableCell>
            <TableCell className="text-center">{dayH}</TableCell>
            <TableCell className="text-center">{nightH}</TableCell>
            <TableCell
              onClick={() => handleCopy(String(totalHours))}
              className="text-gn cursor-copy border-r text-center"
            >
              {totalHours}
            </TableCell>
            <TableCell
              className="cursor-copy border-r text-center"
              onClick={() => handleCopy(String(salary))}
            >
              {isAdmin ? salary : "****"}
            </TableCell>
            <TableCell
              className="cursor-copy text-center"
              onClick={() => handleCopy(String(sendTips))}
            >
              {sendTips}
            </TableCell>
            <TableCell
              className="text-rd cursor-copy text-center"
              onClick={() => handleCopy(String(e.penalty))}
            >
              {e.penalty}
            </TableCell>
            <TableCell
              className="cursor-copy border-r text-center"
              onClick={() => handleCopy(String(e.bonus))}
            >
              {e.bonus}
            </TableCell>
            <TableCell className="text-center">
              {isAdmin ? result : "*****"}
            </TableCell>
          </TableRow>
        ),
      )}

      <TableRow className="font-bold">
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell className="text-center">{totals.dayH}</TableCell>
        <TableCell className="text-center">{totals.nightH}</TableCell>
        <TableCell className="text-center">{totals.totalHours}</TableCell>
        <TableCell className="text-center">
          {isAdmin ? totals.salary : "****"}
        </TableCell>
        <TableCell className="text-center">{totals.sendTips}</TableCell>
        <TableCell className="text-center">{totals.penalty}</TableCell>
        <TableCell className="text-center">{totals.bonus}</TableCell>
        <TableCell className="text-center">
          {isAdmin ? totals.result : "*****"}
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
