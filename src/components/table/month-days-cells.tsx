import { TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type MonthDaysCellsProps = {
  monthDays: { day: number; weekday: string }[];
  selectedDay?: number;
  setSelectedDay?: (day: number) => void;
  orientation?: "top" | "bottom";
  colSpan?: number;
  clasName?: string;
};

export function MonthDaysCells({
  monthDays,
  selectedDay,
  setSelectedDay,
  orientation = "top",
  colSpan = 0,
  clasName,
}: MonthDaysCellsProps) {
  const todayDay = new Date().getDate();
  const day = selectedDay ?? todayDay;
  return (
    <>
      {colSpan > 0 && <TableCell className="p-0" colSpan={colSpan} />}
      {monthDays.map((item) => {
        const isSelected = item.day === day;

        return (
          <TableCell
            key={item.day}
            className={cn("cursor-pointer p-0", clasName)}
            onClick={() => {
              if (!setSelectedDay) return;

              setSelectedDay(item.day);
            }}
          >
            <div
              className={cn(
                "flex flex-col items-center justify-center",
                isSelected && "[&>span]:text-rd font-bold",
              )}
            >
              <span
                className={cn(
                  "text-bl text-xs font-semibold",
                  orientation === "bottom" && "order-2",
                )}
              >
                {item.day}
              </span>

              <span
                className={cn(
                  "text-muted-foreground text-xs",
                  orientation === "bottom" && "order-1",
                )}
              >
                {item.weekday}
              </span>
            </div>
          </TableCell>
        );
      })}
    </>
  );
}
