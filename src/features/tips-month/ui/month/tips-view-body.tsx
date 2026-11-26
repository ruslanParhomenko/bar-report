import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { GetTipsData } from "@/features/tips-month/model/type";
import { cn } from "@/lib/utils";
import { calculateTipsTotal } from "../../lib/utils";

export function TipsViewTableBody({
  data,
  monthDays,
}: {
  data: GetTipsData["tipsData"]["rowEmployeesTips"];
  monthDays: { day: number; weekday: string }[];
}) {
  const { perEmployee } = calculateTipsTotal(data);

  return (
    <TableBody>
      {data.map((item, index) => {
        const employeeTotal = perEmployee[index]?.total ?? 0;
        return (
          <TableRow
            key={`${item.id}-${index}`}
            className="group [&>td]:text-center [&>td]:text-xs"
          >
            <TableCell className="text-rd cursor-pointer">
              {index + 1}
            </TableCell>

            <TableCell className="bg-background hover-cell sticky left-0 w-24 md:bg-transparent">
              <div
                className={cn(
                  "flex h-6 items-center truncate font-bold",
                  item.role === "barmen" && "text-muted-foreground font-light!",
                )}
              >
                {item.employee}
              </div>
            </TableCell>
            <TableCell className="text-end text-green-600">
              {employeeTotal}
            </TableCell>

            {monthDays.map((_, dayIndex) => {
              return (
                <TableCell key={dayIndex} className="border-x">
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
