import EditButton from "@/components/buttons/edit-button";
import PrintButton from "@/components/buttons/print-button";
import ResetButton from "@/components/buttons/reset-button";
import SaveButton from "@/components/buttons/save-button";
import { MonthDaysCells } from "@/components/table/month-days-cells";
import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useAbility } from "@/providers/ability-provider";
import { useMonthDays } from "@/providers/month-days-provider";

export default function AoHeaderTable({
  selectedDay,
  setSelectedDay,
  setIsEdit,
  isEdit,
  ref,
  disabled,
}: {
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
        <TableCell className="bg-background sticky left-0 w-22 md:bg-transparent">
          <div className="flex items-center justify-center gap-3">
            <PrintButton componentRef={ref} disabled={isEdit || disabled} />
            <EditButton
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              disabled={!isAdmin}
            />

            <SaveButton isEdit={isEdit} disabled={!isEdit} />
          </div>
        </TableCell>

        <TableCell className="w-26">
          <div className="flex items-center justify-center gap-4">
            <span>{month?.toUpperCase().slice(0, 3) || ""}</span>
            <ResetButton
              reset={resetSelectedDay}
              className={todayDay === selectedDay ? "hidden" : ""}
            />
          </div>
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
