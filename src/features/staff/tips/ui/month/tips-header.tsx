import AddRowButton from "@/components/buttons/add-row-button";
import SelectDay from "@/components/select/select-day";
import { MonthDaysCells } from "@/components/table/month-days-cells";
import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useMonthDays } from "@/hooks/use-month-days";

export default function TipsHeaderTable({
  addNewRow,
  selectedDay,
  setSelectedDay,
  selectedDayTips,
  setSelectedDayTips,
  isEdit,
}: {
  addNewRow: () => void;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  selectedDayTips: string | null;
  setSelectedDayTips: (day: string | null) => void;
  isEdit: boolean;
}) {
  const { monthDays, month } = useMonthDays();

  return (
    <TableHeader>
      <TableRow>
        <TableCell className="w-4 p-0"></TableCell>

        <TableCell className="w-28 pl-4">
          <div className="flex items-center justify-between">
            {isEdit && (
              <div className="flex items-center justify-center gap-2 px-2">
                <AddRowButton addNewRow={addNewRow} />
                <SelectDay
                  value={selectedDayTips || ""}
                  onChange={setSelectedDayTips}
                  monthDays={monthDays}
                />
              </div>
            )}
            <span className="text-muted-foreground px-2 text-xs">
              {month || ""}
            </span>
          </div>
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
