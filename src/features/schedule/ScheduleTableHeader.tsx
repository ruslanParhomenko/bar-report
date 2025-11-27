import { Button } from "@/components/ui/button";
import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getMonthDays } from "@/utils/getMonthDays";
import { Plus } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import ScheduleActionButton from "./ScheduleActionButton";

export default function ScheduleTableHeader({
  setSelectedColumn,
  componentRef,
  patch,
  scheduleId,
  addNewRow,
  isSave = false,
}: {
  setSelectedColumn?: (index: number) => void;
  componentRef?: React.RefObject<HTMLDivElement | null>;
  patch: string;
  scheduleId?: string;
  addNewRow?: () => void;
  isSave?: boolean;
}) {
  const { id } = useParams();
  console.log("id", id);
  const params = useSearchParams();
  const month = params.get("month") as string;
  const year = params.get("year") as string;

  const todayDay = new Date().getDate();

  const monthDays = getMonthDays({ month: month, year: year });

  const todayIndex = monthDays.findIndex((day) => day.day === todayDay);
  useEffect(() => {
    if (!setSelectedColumn) return;
    if (todayIndex !== -1) {
      setSelectedColumn(todayIndex);
    }
  }, [todayIndex]);

  return (
    <TableHeader>
      <TableRow className="h-10!">
        <TableCell colSpan={4} className="w-40 text-start p-0">
          {/* {id && isCreate && (
            <Button
              onClick={addNewRow && addNewRow}
              variant="ghost"
              size="sm"
              type="button"
              className="cursor-pointer hover:bg-bl/40"
            >
              <Plus className="h-3 w-3" />
            </Button>
          )} */}
          <ScheduleActionButton
            ref={componentRef}
            patch={patch}
            scheduleId={scheduleId as string}
            isSave={isSave}
          />
        </TableCell>
        <TableCell className="w-32  front-bold text-end">
          {month?.toUpperCase() || ""}
        </TableCell>

        <TableCell
          className="w-16 p-0 no-print"
          data-html2canvas-ignore="true"
        />

        {monthDays.map((day, index) => {
          return (
            <TableCell
              key={day.day}
              className={cn(
                "w-10 cursor-pointer p-0",
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

        <TableCell className="w-6 p-0" />
      </TableRow>
    </TableHeader>
  );
}
