import AddRowButton from "@/components/buttons/add-row-button";
import EditButton from "@/components/buttons/edit-button";
import PrintButton from "@/components/buttons/print-button";
import ResetButton from "@/components/buttons/reset-button";
import SaveButton from "@/components/buttons/save-button";
import { MonthDaysCells } from "@/components/table/month-days-cells";
import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useAbility } from "@/providers/ability-provider";
import { useMonthDays } from "@/providers/month-days-provider";

export default function TipsHeaderTable({
  addNewRow,
  selectedDay,
  setSelectedDay,
  setIsEdit,
  isEdit,
  ref,
  disabled,
}: {
  addNewRow: () => void;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  setIsEdit: (isEdit: boolean) => void;
  isEdit: boolean;
  ref: React.RefObject<HTMLDivElement | null>;
  disabled: boolean;
}) {
  const { isAdmin } = useAbility();
  const { monthDays, month } = useMonthDays();

  const todayDay = new Date().getDate();
  const resetSelectedDay = () => {
    setSelectedDay(todayDay);
  };
  return (
    <TableHeader>
      <TableRow>
        <TableCell className="w-5">
          <div className="flex items-center justify-center">
            <PrintButton componentRef={ref} disabled={isEdit || disabled} />
          </div>
        </TableCell>

        <TableCell className="w-30">
          <div className="flex items-center justify-center gap-4">
            <EditButton
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              disabled={!isAdmin}
            />

            <SaveButton isEdit={isEdit} disabled={!isEdit} />
            <AddRowButton
              isEdit={isEdit}
              addNewRow={addNewRow}
              disabled={!isEdit}
            />
            <ResetButton
              reset={resetSelectedDay}
              className={todayDay === selectedDay ? "hidden" : ""}
            />
          </div>
        </TableCell>
        <TableCell className="w-11 font-bold">
          {month?.toUpperCase().slice(0, 3) || ""}
        </TableCell>
        <MonthDaysCells
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          monthDays={monthDays}
          clasName="w-12"
        />
      </TableRow>
    </TableHeader>
  );
}
