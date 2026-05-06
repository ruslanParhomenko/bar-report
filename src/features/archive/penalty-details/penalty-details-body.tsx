import { TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function PenaltyDetailsBody({
  rows,
  editRemarks,
}: {
  rows: Array<{
    day: string;
    uniqueKey: string;
    name: string;
    dayHours: number;
    nightHours: number;
    reason: string;
    bonus: number;
    penalty: number;
  }>;
  editRemarks: (day: string) => void;
}) {
  return (
    <TableBody>
      {rows.map((row, index) => (
        <TableRow
          key={index}
          className="hover:text-rd hover:bg-accent cursor-pointer hover:font-bold [&>td]:py-1 [&>td]:text-xs"
          onClick={() => editRemarks(row.day)}
        >
          <TableCell className="text-xs">{row.day}</TableCell>
          <TableCell className="bg-background/90 sticky left-0 z-20 text-xs md:bg-inherit">
            {row.name}
          </TableCell>
          <TableCell className="text-center">{row.dayHours}</TableCell>
          <TableCell className="text-center">{row.nightHours}</TableCell>
          <TableCell>{row.reason}</TableCell>
          <TableCell className="text-center">{row.bonus}</TableCell>
          <TableCell className="text-center">{row.penalty}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
