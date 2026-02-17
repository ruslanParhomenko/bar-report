"use client";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useResultCalculations } from "./utils";
import { useAbility } from "@/providers/ability-provider";
import { handleCopy } from "@/utils/handler-copy-text";

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
              className="sticky left-0 bg-card cursor-copy"
              onClick={() => handleCopy(e.employee)}
            >
              {e.employee}
            </TableCell>
            <TableCell className="text-center border-r">
              {Number(rate) / 1000}
            </TableCell>
            <TableCell className="text-center">{dayH}</TableCell>
            <TableCell className="text-center">{nightH}</TableCell>
            <TableCell
              onClick={() => handleCopy(String(totalHours))}
              className="text-center text-gn border-r cursor-copy"
            >
              {totalHours}
            </TableCell>
            <TableCell
              className="text-center border-r cursor-copy"
              onClick={() => handleCopy(String(salary))}
            >
              {isAdmin ? salary : "****"}
            </TableCell>
            <TableCell
              className="text-center cursor-copy"
              onClick={() => handleCopy(String(sendTips))}
            >
              {sendTips}
            </TableCell>
            <TableCell
              className="text-center text-rd cursor-copy"
              onClick={() => handleCopy(String(e.penalty))}
            >
              {e.penalty}
            </TableCell>
            <TableCell
              className="text-center border-r cursor-copy"
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
