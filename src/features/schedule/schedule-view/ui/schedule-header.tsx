"use client";
import AddRowButton from "@/components/buttons/add-row-button";
import { MonthDaysCells } from "@/components/table/month-days-cells";
import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useMonthDays } from "@/hooks/use-month-days";

export default function ScheduleTableHeader({
  addNewRow,
  selectedDay,
  setSelectedDay,
  isEdit,
  isAdmin,
}: {
  addNewRow: () => void;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  isEdit?: boolean;
  isAdmin: boolean;
}) {
  const { monthDays, month } = useMonthDays();
  return (
    <TableHeader>
      <TableRow>
        <TableCell className="w-4" />
        <TableCell className="w-8 py-1">
          {isEdit && isAdmin && <AddRowButton addNewRow={addNewRow} />}
        </TableCell>
        <TableCell className="w-7" />
        <TableCell className="w-8" />
        <TableCell className="w-8" />

        <TableCell className="text-bl w-28 pl-2 tracking-wider">
          {month?.toUpperCase() || ""}
        </TableCell>
        <TableCell className="w-4 p-0" />

        <MonthDaysCells
          monthDays={monthDays}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          orientation="top"
          className="w-8.5 print:w-7.5"
        />
      </TableRow>
    </TableHeader>
  );
}
