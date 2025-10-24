import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

export default function ScheduleFooter({ data }: { data: string[] }) {
  const form = useFormContext();
  const values = form.watch();

  const shiftCounts = useMemo(() => {
    if (!values?.rowShifts?.length) return {};

    const daysCount = values.rowShifts[0]?.shifts?.length || 0;
    const result = Object.fromEntries(
      data.map((shift) => [shift, Array(daysCount).fill(0)])
    );
    values.rowShifts.forEach((row: any) => {
      row?.shifts?.forEach((shiftValue: string, dayIndex: number) => {
        if (!shiftValue) return;

        const shiftParts = shiftValue.split(".");

        shiftParts.forEach((part) => {
          if (data.includes(part)) {
            result[part][dayIndex] += 1;
          }
        });
      });
    });

    return result;
  }, [values, data]);

  return (
    <TableFooter>
      {data.map((item, rowIndex) => (
        <TableRow key={rowIndex} className="h-[16px] bg-card p-0 border-0">
          <TableCell
            colSpan={6}
            className="text-end text-muted-foreground h-[16px] py-0 leading-none text-xs"
          >
            {item}
          </TableCell>

          {shiftCounts?.[item]?.map((day, index) => (
            <TableCell
              key={index}
              className="w-8 text-center h-[16px] py-0 leading-none text-xs"
            >
              {day === 0 ? null : day}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableFooter>
  );
}
