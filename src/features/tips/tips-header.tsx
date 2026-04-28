import AddRowButton from "@/components/buttons/add-row-button";
import { MonthDaysCells } from "@/components/table/month-days-cells";
import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useMonthDays } from "@/providers/month-days-provider";

export default function TipsHeaderTable({
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

        <TableCell className="w-28 pl-4">
          {month?.toUpperCase() || ""}
        </TableCell>
        <TableCell className="w-10 p-0 text-center font-bold"></TableCell>
        <MonthDaysCells
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          monthDays={monthDays}
          className="w-9"
        />
      </TableRow>
    </TableHeader>
  );
}
