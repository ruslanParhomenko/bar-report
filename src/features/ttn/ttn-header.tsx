import EditButton from "@/components/buttons/edit-button";
import PrintButton from "@/components/buttons/print-button";
import ResetButton from "@/components/buttons/reset-button";
import SaveButton from "@/components/buttons/save-button";
import { MonthDaysCells } from "@/components/table/month-days-cells";
import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useAbility } from "@/providers/ability-provider";
import { useMonthDays } from "@/providers/month-days-provider";

export default function TtnHeaderTable({
  setItemSearch,
  selectedDay,
  setSelectedDay,
  setIsEdit,
  isEdit,
  ref,
  disabled,
}: {
  setItemSearch: (itemSearch: string) => void;
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
        <TableCell className="bg-background sticky left-0 md:bg-transparent">
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

        <TableCell>
          <input
            type="text"
            placeholder="...search"
            onChange={(e) => setItemSearch(e.target.value)}
            className="w-20 p-1 outline-none focus:ring-0 focus:outline-none focus-visible:ring-0"
          ></input>
        </TableCell>
        <TableCell>
          <div className="flex items-center justify-center gap-2">
            <ResetButton
              reset={resetSelectedDay}
              className={todayDay === selectedDay ? "hidden" : ""}
              size={12}
            />
            <span>{month?.toUpperCase().slice(0, 3) || ""}</span>
          </div>
        </TableCell>

        <MonthDaysCells
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          monthDays={monthDays}
        />
      </TableRow>
    </TableHeader>
  );
}
