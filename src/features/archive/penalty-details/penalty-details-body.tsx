import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { PenBox, Trash2 } from "lucide-react";

export default function PenaltyDetailsBody({
  rows,
  editRemarks,
  deleteRemarks,
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
  deleteRemarks: (uniqueKey: string, day: string) => Promise<void>;
}) {
  return (
    <TableBody>
      {rows.map((row, index) => (
        <TableRow
          key={index}
          className="hover:text-rd hover:bg-accent hover:font-bold [&>td]:py-1 [&>td]:text-xs"
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
          <TableCell>
            <div className="flex cursor-pointer items-center justify-around">
              <PenBox
                className="text-bl h-3.5 w-4"
                onClick={() => editRemarks(row.day)}
              />
              <Trash2
                className="text-rd mr-2 h-3.5 w-4"
                onClick={() => deleteRemarks(row.uniqueKey, row.day)}
              />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
