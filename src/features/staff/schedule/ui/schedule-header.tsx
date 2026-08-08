"use client";
import AddRowButton from "@/components/buttons/add-row-button";
import { MonthDaysCells } from "@/components/table/month-days-cells";
import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useMonthDays } from "@/providers/month-days-provider";

export default function ScheduleTableHeader({
  addNewRow,
  selectedDay,
  setSelectedDay,
  isEdit,
}: {
  addNewRow: () => void;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  isEdit: boolean;
}) {
  const { monthDays, month } = useMonthDays();
  return (
    <TableHeader>
      <TableRow>
        <TableCell className="w-6 p-0">
          {isEdit && <AddRowButton isEdit={isEdit} addNewRow={addNewRow} />}
        </TableCell>
        <TableCell
          colSpan={5}
          className={cn(isEdit ? "w-34" : "w-30 print:w-28")}
        ></TableCell>
        <TableCell className="w-24 pl-2">
          {month?.toUpperCase() || ""}
        </TableCell>

        <MonthDaysCells
          monthDays={monthDays}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          orientation="top"
          className="w-8.5 print:w-7.5"
        />

        <TableCell className="w-4 p-0" />
      </TableRow>
    </TableHeader>
  );
}
