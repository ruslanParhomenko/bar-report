import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { handleMultiTableNavigation } from "@/utils/handle-table-navigation";

import { useFormContext, useWatch } from "react-hook-form";

export default function TipsCashBody({
  monthDays,
}: {
  monthDays: { day: number; weekday: string }[];
}) {
  const { control, register } = useFormContext();
  const value = useWatch({
    control,
    name: "rowCashTips",
  });
  const total = value
    ?.reduce((acc: number, val: string) => acc + Number(val || 0), 0)
    .toFixed(0);
  return (
    <TableBody>
      <TableRow>
        <TableCell
          colSpan={monthDays?.length + 2}
          className="h-10 border-0 text-xs"
        >
          CASH
        </TableCell>
      </TableRow>

      <TableRow className="border-b!">
        <TableCell className="text-xs">1</TableCell>

        <TableCell
          className={cn(
            "font-medium sticky left-0 p-0 px-1 text-left text-md bg-background",
          )}
        >
          tipsCash
        </TableCell>
        <TableCell className={cn("text-right border-r  pr-2 text-xs")}>
          {total}
        </TableCell>

        {monthDays.map((_, dayIndex) => (
          <TableCell key={dayIndex} className="p-0 text-center border-x">
            <input
              type="text"
              data-col={dayIndex}
              {...register(`rowCashTips.${dayIndex}`)}
              className={cn("border-0 h-7 w-12 text-xs text-center")}
              onKeyDown={handleMultiTableNavigation}
            />
          </TableCell>
        ))}
      </TableRow>
    </TableBody>
  );
}
