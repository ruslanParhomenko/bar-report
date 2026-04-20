import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useContext } from "react";
import { RefContext } from "@/providers/client-ref-provider";
import { PenBox, PenOff, PlusCircleIcon, SaveIcon } from "lucide-react";
import PrintButton from "@/components/buttons/print-button";
import MailButton from "@/components/buttons/mail-button";

type ScheduleTableHeaderProps = {
  month: string;
  addNewRow: () => void;
  monthDays: { day: number; weekday: string }[];
  selectedDay?: string;
  setSelectedDay?: (day: string) => void;
  setIsEdit?: (isEdit: boolean) => void;
  isEdit: boolean;
  tab: string;
};

export default function ScheduleTableHeader({
  month,
  addNewRow,
  monthDays,
  selectedDay,
  setSelectedDay,
  setIsEdit,
  isEdit,
  tab,
}: ScheduleTableHeaderProps) {
  const todayDay = new Date().getDate();

  const ref = useContext(RefContext);

  return (
    <TableHeader>
      <TableRow className="h-14!">
        <TableCell colSpan={6} className="w-42">
          <div className="flex justify-center items-start gap-3">
            <button
              type="button"
              onClick={() => {
                setIsEdit && setIsEdit(!isEdit);
              }}
              className="cursor-pointer"
            >
              {isEdit ? (
                <PenOff className="h-5 w-5 hover:text-bl" />
              ) : (
                <PenBox className="h-5 w-5 hover:text-bl" />
              )}
            </button>
            <PrintButton
              componentRef={ref}
              disabled={isEdit}
              className="text-bl"
            />

            <MailButton
              componentRef={ref}
              disabled={isEdit}
              patch={tab}
              className="text-bl"
            />
            <button
              type="button"
              onClick={() => {
                addNewRow();
              }}
              className={"cursor-pointer text-bl"}
              disabled={!isEdit}
            >
              <PlusCircleIcon
                className={cn("h-5 w-5", isEdit && "text-rd")}
                strokeWidth={ref ? 1.5 : 2}
              />
            </button>
            <button
              type="submit"
              disabled={!isEdit}
              className={"cursor-pointer"}
            >
              <SaveIcon
                className={cn("h-5 w-5 text-bl", !isEdit && "opacity-50")}
                strokeWidth={ref ? 1.5 : 2}
              />
            </button>
          </div>
        </TableCell>
        <TableCell className="text-base pl-2  w-26">
          {month?.toUpperCase() || ""}
        </TableCell>

        {monthDays
          ?.filter((_, index) =>
            !selectedDay || selectedDay === "0"
              ? true
              : Number(selectedDay) === index + 1,
          )
          .map((day) => (
            <TableCell
              key={day.day}
              className={cn(
                "w-9 cursor-pointer p-0",
                day.day === todayDay && "text-rd font-bold",
              )}
              onClick={() => {
                if (setSelectedDay) {
                  if (selectedDay === day.day.toString()) {
                    setSelectedDay("0");
                  } else {
                    setSelectedDay(day.day.toString());
                  }
                }
              }}
            >
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold">{day.day}</span>
                <span className="text-xs text-muted-foreground">
                  {day.weekday}
                </span>
              </div>
            </TableCell>
          ))}

        <TableCell className="w-4 p-0" />
      </TableRow>
    </TableHeader>
  );
}
