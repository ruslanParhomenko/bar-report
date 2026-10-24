"use client";
import NumericInput from "@/components/input-controlled/numeric-input";
import SelectField from "@/components/input-controlled/select-field";
import { MonthDaysCells } from "@/components/table/month-days-cells";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

import { SortableRow } from "@/components/table/sortable-row";
import AppTooltip from "@/components/ui/app-tooltip";
import { Employee } from "@/features/settings/create-employee/model/type";
import { useMonthDays } from "@/hooks/use-month-days";
import { handleMultiTableNavigation } from "@/utils/handle-table-navigation";
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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  FieldArrayWithId,
  UseFieldArrayReturn,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { calculateSalaryByHours, calculateShiftTotals } from "../lib/utils";
import { color, SHIFT_COLOR_MAP } from "../model/constants";
import { ScheduleType } from "../model/schema";

export default function ScheduleBodyEdit({
  fields,
  selectedEmployees,
  remove,
  move,
  update,
  selectedDay,
  setSelectedDay,
  isAdmin,
}: {
  fields: FieldArrayWithId<ScheduleType, "rowShifts", "id">[];
  selectedEmployees: Employee[];
  remove: UseFieldArrayReturn<ScheduleType, "rowShifts", "id">["remove"];
  move: UseFieldArrayReturn<ScheduleType, "rowShifts", "id">["move"];
  update: UseFieldArrayReturn<ScheduleType, "rowShifts", "id">["update"];
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  isAdmin: boolean;
}) {
  const form = useFormContext<ScheduleType>();
  const { control, getValues } = form;

  const employeesLength = fields?.length || 0;

  const { monthDays } = useMonthDays();
  const isMobile = useIsMobile();

  const shifts = useWatch({
    control: control,
    name: "rowShifts",
  });

  function handleEmployeeChange(selectedName: string, rowIndex: number) {
    const employee = selectedEmployees.find(
      (e) => e.name.trim() === selectedName.trim(),
    );
    if (!employee) return;

    update(rowIndex, {
      ...getValues(`rowShifts.${rowIndex}`),
      employee: employee.name,
      role: employee.role,
      rate: employee.rate,
      employeeId: employee.id,
    });
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const from = fields.findIndex((f) => f.id === active.id);
    const to = fields.findIndex((f) => f.id === over.id);
    if (from !== -1 && to !== -1) move(from, to);
  }

  return (
    <TableBody>
      <DndContext
        id="schedule-dnd"
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
          items={fields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          {fields.map((row, rowIndex) => {
            const rowShifts = shifts[rowIndex] || [];
            const { totalDay, totalNight, total } = calculateShiftTotals(
              rowShifts.shifts,
            );

            const totalPay = calculateSalaryByHours({
              ...rowShifts,
              dayHours: String(totalDay),
              nightHours: String(totalNight),
            });

            const isSelected = !SHIFT_COLOR_MAP.includes(
              row.shifts?.[Number(selectedDay) - 1],
            );
            return (
              <SortableRow
                id={row.id}
                key={row.id}
                className="group hover:text-green-600! [&>td]:p-0 [&>td]:text-xs"
              >
                {(handle) => (
                  <>
                    <TableCell
                      className="text-rd cursor-pointer px-1 py-0 text-xs"
                      onClick={() => remove(rowIndex)}
                    >
                      <AppTooltip content="удалить">
                        <span>{rowIndex + 1}</span>
                      </AppTooltip>
                    </TableCell>

                    <TableCell className="hover-cell text-bl">
                      <div className="flex flex-col items-center justify-center leading-tight">
                        <span className="text-[11px]!">{totalDay || 0}</span>
                        <span className="text-muted-foreground w-full border-t text-center text-[11px]!">
                          {totalNight || 0}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-gn px-0 text-center text-xs">
                      {total || 0}
                    </TableCell>

                    <TableCell className="text-muted-foreground text-center">
                      {row.role.charAt(0).toLocaleLowerCase()}:
                      {isAdmin && Number(row.rate) / 1000}
                    </TableCell>
                    <TableCell className="text-bl text-[11px]!">
                      {isAdmin && totalPay && totalPay.toFixed()}
                    </TableCell>
                    <TableCell className="bg-background sticky left-0 pl-2! md:bg-transparent">
                      <SelectField
                        fieldName={`rowShifts.${rowIndex}.employee`}
                        data={selectedEmployees.map((e) => e.name)}
                        className={cn(
                          "hover-cell truncate p-0 text-xs",
                          isSelected && "text-rd font-bold",
                          employeesLength < 18 ? "h-9" : "h-7!",
                        )}
                        onChange={(name) =>
                          handleEmployeeChange(name, rowIndex)
                        }
                      />
                    </TableCell>

                    <TableCell className="p-0 text-center">
                      <AppTooltip content="переместить">
                        <div className="flex justify-center print:hidden">
                          {handle}
                        </div>
                      </AppTooltip>{" "}
                    </TableCell>

                    {row.shifts.map((shiftValue, dayIndex) => {
                      const isSelected = dayIndex === selectedDay - 1;
                      return (
                        <TableCell
                          key={dayIndex}
                          className={cn(
                            "border-x",
                            isSelected && "text-rd font-bold",
                          )}
                        >
                          {!isMobile ? (
                            <input
                              {...form.register(
                                `rowShifts.${rowIndex}.shifts.${dayIndex}`,
                              )}
                              data-row={rowIndex}
                              data-col={dayIndex}
                              onKeyDown={handleMultiTableNavigation}
                              className={cn(
                                "hover-cell h-full w-full text-center",
                                shiftValue === "" ? "bg-border/20" : "",
                                color[shiftValue as keyof typeof color],
                                employeesLength < 18 ? "h-9" : "h-8!",
                              )}
                              onFocus={() => setSelectedDay(dayIndex + 1)}
                            />
                          ) : (
                            <NumericInput
                              fieldName={`rowShifts.${rowIndex}.shifts.${dayIndex}`}
                              className={cn(
                                "hover-cell h-9 w-full rounded-none! border-0 p-0 text-center text-xs shadow-none",
                                shiftValue === "" ? "bg-border/20" : "",
                                color[shiftValue as keyof typeof color],
                              )}
                            />
                          )}
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
          colSpan={7}
          className="h-10"
        />
      </TableRow>
    </TableBody>
  );
}
