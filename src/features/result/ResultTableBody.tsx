import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useResultCalculations } from "./utils";

export default function ResultTableBody({
  rows,
  totals,
}: {
  rows: ReturnType<typeof useResultCalculations>["rows"];
  totals: ReturnType<typeof useResultCalculations>["totals"];
}) {
  return (
    <TableBody>
      {rows.map(
        (
          { e, dayH, nightH, totalHours, rate, salary, sendTips, result },
          index
        ) => (
          <TableRow key={index}>
            <TableCell className="sticky left-0 bg-background/60">
              {e.employee}
            </TableCell>
            <TableCell className="text-center">{rate}</TableCell>
            <TableCell className="text-center font-bold">{sendTips}</TableCell>
            <TableCell className="text-center text-rd">{e.penalty}</TableCell>
            <TableCell className="text-center">{e.bonus}</TableCell>
            <TableCell></TableCell>
            <TableCell className="text-center">{dayH}</TableCell>
            <TableCell className="text-center">{nightH}</TableCell>
            <TableCell className="text-center text-gn font-bold">
              {totalHours}
            </TableCell>
            <TableCell className="text-center">{salary}</TableCell>
            <TableCell className="text-center">{result}</TableCell>
          </TableRow>
        )
      )}

      <TableRow className="font-bold">
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell className="text-center">{totals.sendTips}</TableCell>
        <TableCell className="text-center">{totals.penalty}</TableCell>
        <TableCell className="text-center">{totals.bonus}</TableCell>
        <TableCell></TableCell>
        <TableCell className="text-center">{totals.dayH}</TableCell>
        <TableCell className="text-center">{totals.nightH}</TableCell>
        <TableCell className="text-center">{totals.totalHours}</TableCell>
        <TableCell className="text-center">{totals.salary}</TableCell>
        <TableCell className="text-center">{totals.result}</TableCell>
      </TableRow>
    </TableBody>
  );
}
