import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { GetTipsData } from "@/features/staff/tips/model/type";
import { cn } from "@/lib/utils";
import { calculateTipsTotal } from "../../lib/utils";

export function TipsViewTableBody({
  data,
  monthDays,
  selectedDay,
}: {
  data: GetTipsData["tipsData"]["rowEmployeesTips"];
  monthDays: { day: number; weekday: string }[];
  selectedDay: number;
}) {
  const { perEmployee } = calculateTipsTotal(data);

  return (
    <TableBody>
      {data.map((item, index) => {
        const employeeTotal = perEmployee[index]?.total ?? 0;
        return (
          <TableRow key={item.id} className="group">
            <TableCell className="text-rd cursor-pointer p-0.5 text-xs">
              {index + 1}
            </TableCell>

            <TableCell className="bg-background hover-cell sticky left-0 w-24 p-1 md:bg-transparent">
              <div
                className={cn(
                  "flex h-6 items-center truncate text-xs font-bold",
                  item.role === "barmen" && "text-muted-foreground font-light!",
                )}
              >
                {item.employee}
              </div>
            </TableCell>
            <TableCell className="p-0 pr-2 text-end text-xs text-green-600">
              {employeeTotal}
            </TableCell>

            {monthDays.map((_, dayIndex) => {
              const isSelected = dayIndex + 1 === selectedDay;
              return (
                <TableCell
                  key={dayIndex}
                  className="border-x p-0.5 text-center text-xs"
                >
                  {item.tipsByDay[dayIndex]}
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
    </TableBody>
  );
}
