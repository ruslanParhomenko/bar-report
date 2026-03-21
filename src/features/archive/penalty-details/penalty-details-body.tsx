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
          className="hover:text-rd hover:font-bold hover:bg-accent [&>td]:py-1 [&>td]:text-xs"
        >
          <TableCell className="text-xs">{row.day}</TableCell>
          <TableCell className="sticky left-0 bg-background/90 md:bg-inherit z-20 text-xs">
            {row.name}
          </TableCell>
          <TableCell className="text-center">{row.dayHours}</TableCell>
          <TableCell className="text-center">{row.nightHours}</TableCell>
          <TableCell>{row.reason}</TableCell>
          <TableCell className="text-center">{row.bonus}</TableCell>
          <TableCell className="text-center">{row.penalty}</TableCell>
          <TableCell>
            <div className="flex justify-around items-center cursor-pointer">
              <PenBox
                className="w-4 h-3.5 text-bl"
                onClick={() => editRemarks(row.day)}
              />
              <Trash2
                className="w-4 h-3.5 text-rd mr-2"
                onClick={() => deleteRemarks(row.uniqueKey, row.day)}
              />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
