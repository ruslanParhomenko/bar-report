"use client";
import { MonthDaysCells } from "@/components/table/month-days-cells";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { SortableRow } from "@/components/table/sortable-row";
import AppTooltip from "@/components/ui/app-tooltip";
import { useMonthDays } from "@/hooks/use-month-days";
import { getInvalidConsecutiveShiftIndexes } from "@/utils/invalid-shifts";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { calculateSalaryByHours } from "../../schedule-edit/lib/utils";
import { color, SHIFT_COLOR_MAP } from "../../schedule-edit/model/constants";
import { GetScheduleData } from "../../schedule-edit/model/type";

type Rows = NonNullable<GetScheduleData>["rowShifts"];

export default function ScheduleTableBody({
  schedule,
  selectedDay,
  isAdmin,
}: {
  schedule: GetScheduleData | null;
  selectedDay: number;
  isAdmin: boolean;
}) {
  const { monthDays } = useMonthDays();

  const [rows, setRows] = useState<Rows>(schedule?.rowShifts ?? []);
  useEffect(() => {
    setRows(schedule?.rowShifts ?? []);
  }, [schedule]);

  const employeesLength = rows.length;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    setRows((prev) => {
      const from = prev.findIndex((r) => r.id === active.id);
      const to = prev.findIndex((r) => r.id === over.id);
      return from === -1 || to === -1 ? prev : arrayMove(prev, from, to);
    });
  }

  return (
    <TableBody>
      <DndContext
        id="schedule-view-dnd"
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
        accessibility={{
          container:
            typeof document !== "undefined" ? document.body : undefined,
        }}
      >
        <SortableContext
          items={rows.map((r) => r.id)}
          strategy={verticalListSortingStrategy}
        >
          {rows.map((row, rowIndex) => {
            const isSelected = !SHIFT_COLOR_MAP.includes(
              row.shifts?.[Number(selectedDay) - 1],
            );
            const totalPay = isAdmin
              ? calculateSalaryByHours(row).toFixed(0).toString()
              : "0";

            const { invalidIndex, invalidRest, overRest } =
              getInvalidConsecutiveShiftIndexes(row.shifts);

            return (
              <SortableRow
                key={row.id}
                id={row.id}
                className="print:[&>td]:text-md! print:h-12 [&>td]:py-0.5"
              >
                {(handle) => (
                  <>
                    <TableCell className="px-1 text-xs print:px-0">
                      {rowIndex + 1}
                    </TableCell>
                    <TableCell className="hover-cell text-bl">
                      <div className="flex flex-col items-center justify-center leading-tight">
                        <span className="text-[11px]">{row.dayHours || 0}</span>
                        <span className="text-muted-foreground w-full border-t text-center text-[11px]">
                          {row.nightHours || 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gn px-0 text-center text-xs">
                      {row.totalHours}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-center text-xs">
                      {row.role.charAt(0).toLocaleLowerCase()}-
                      {isAdmin && Number(row.rate) / 1000} :{" "}
                      <span className={cn("text-bl px-1")}>
                        {isAdmin && totalPay && totalPay}
                      </span>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "bg-background text-muted-foreground sticky left-0 truncate pr-1 pl-3 text-xs md:bg-transparent",
                        isSelected && "text-rd font-bold",
                        employeesLength < 18 && "h-9",
                      )}
                    >
                      {row.employee}
                    </TableCell>

                    <TableCell className="px-0">
                      <AppTooltip content="переместить">
                        <div className="flex justify-center print:hidden">
                          {handle}
                        </div>
                      </AppTooltip>
                    </TableCell>

                    {row.shifts.map((day, dayIndex) => {
                      const isSelected = dayIndex === selectedDay - 1;
                      const isInvalidConsecutive = invalidIndex.has(dayIndex);
                      const isInvalidRest = invalidRest.has(dayIndex);
                      const isOverRest = overRest.has(dayIndex);

                      return (
                        <TableCell
                          key={dayIndex}
                          className={cn(
                            "border-x p-0 text-center text-xs",
                            color[day as keyof typeof color],
                            isSelected && "text-rd font-bold",
                            isInvalidConsecutive && "bg-br/40",
                            isInvalidRest && "bg-br/40",
                            isOverRest && "bg-gr/30 border-0",
                          )}
                        >
                          {SHIFT_COLOR_MAP.includes(day) ? null : day}
                        </TableCell>
                      );
                    })}
                  </>
                )}
              </SortableRow>
            );
          })}
        </SortableContext>
      </DndContext>

      <TableRow>
        <MonthDaysCells
          monthDays={monthDays}
          selectedDay={selectedDay}
          orientation="bottom"
          colSpan={6}
          className="h-10"
        />
      </TableRow>
    </TableBody>
  );
}
