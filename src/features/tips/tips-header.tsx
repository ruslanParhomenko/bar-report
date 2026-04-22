import PrintButton from "@/components/buttons/print-button";
import { MonthDaysCells } from "@/components/table/month-days-cells";
import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useMonthDays } from "@/providers/month-days-provider";
import {
  PenBox,
  PenOff,
  PlusCircleIcon,
  RotateCw,
  SaveIcon,
} from "lucide-react";

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
  setIsEdit?: (isEdit: boolean) => void;
  isEdit: boolean;
  ref: React.RefObject<HTMLDivElement | null>;
  disabled: boolean;
}) {
  const { monthDays, month } = useMonthDays();

  const todayDay = new Date().getDate();
  return (
    <TableHeader>
      <TableRow>
        <TableCell className="w-5">
          <div className="flex justify-center items-center">
            <PrintButton
              componentRef={ref}
              disabled={isEdit || disabled}
              className="text-bl"
            />
          </div>
        </TableCell>

        <TableCell className="w-40">
          <div className="flex justify-center gap-4 items-center">
            <button
              type="button"
              onClick={() => {
                setIsEdit && setIsEdit(!isEdit);
              }}
              className="cursor-pointer"
              disabled={disabled}
            >
              {isEdit ? (
                <PenOff className="h-5 w-5 hover:text-bl" />
              ) : (
                <PenBox className="h-5 w-5 hover:text-bl" />
              )}
            </button>

            <button
              type="submit"
              disabled={!isEdit || disabled}
              className={"cursor-pointer"}
            >
              <SaveIcon
                className={cn("h-5 w-5", !isEdit ? "opacity-50" : "text-rd")}
              />
            </button>
            <button
              type="button"
              className="cursor-pointer hover:bg-accent"
              onClick={() => addNewRow()}
              disabled={disabled}
            >
              <PlusCircleIcon className="text-bl h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setSelectedDay && setSelectedDay(todayDay)}
              className={selectedDay === todayDay ? "hidden" : "cursor-pointer"}
            >
              <RotateCw className="text-rd  h-4.5 w-4" />
            </button>
          </div>
        </TableCell>
        <TableCell className="w-11 font-bold">
          {month?.toUpperCase().slice(0, 3) || ""}
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
