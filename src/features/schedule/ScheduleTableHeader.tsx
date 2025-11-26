import { Button } from "@/components/ui/button";
import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getMonthDays } from "@/utils/getMonthDays";
import { Plus } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function ScheduleTableHeader({
  setSelectedColumn,
  addNewRow,
  isTop = true,
  isCreate = false,
}: {
  setSelectedColumn?: (index: number) => void;
  addNewRow?: () => void;
  isTop?: boolean;
  isCreate?: boolean;
}) {
  const { id } = useParams();
  const params = useSearchParams();
  const month = params.get("month") as string;
  const year = params.get("year") as string;

  const todayDay = new Date().getDate();

  const monthDays = useMemo(() => {
    if (!month || !year) return [];
    return getMonthDays({ month: month, year: year });
  }, [month, year]);

  return (
    <TableHeader>
      <TableRow className={cn(isTop ? "" : "border-0! no-print")}>
        <TableCell className="w-6 text-start p-0">
          {id && isCreate && (
            <Button
              onClick={addNewRow && addNewRow}
              variant="ghost"
              size="sm"
              type="button"
              className="cursor-pointer hover:bg-bl/40"
            >
              <Plus className="h-3 w-3" />
            </Button>
          )}
        </TableCell>
        <TableCell className="w-6" />
        <TableCell className="w-6" />
        <TableCell className="w-8" />
        <TableCell className="w-28 p-0 front-bold text-center">
          {(isTop && month?.toUpperCase()) || ""}
        </TableCell>
        {id && (
          <TableCell
            className="w-18 p-0 no-print"
            data-html2canvas-ignore="true"
          />
        )}
        <TableCell
          className="w-8 p-0 no-print"
          data-html2canvas-ignore="true"
        />

        {monthDays.map((day, index) => {
          return (
            <TableCell
              key={day.day}
              className={cn(
                "w-9 cursor-pointer p-0",
                day.day === todayDay && "text-rd front-bold"
              )}
              onClick={() => setSelectedColumn && setSelectedColumn(index)}
            >
              <div className="text-sm font-semibold text-center">{day.day}</div>
              <div className="text-xs text-muted-foreground text-center">
                {day.weekday}
              </div>
            </TableCell>
          );
        })}

        {(id || isCreate) && <TableCell className="w-3" />}
      </TableRow>
    </TableHeader>
  );
}
