"use client";
import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useContext } from "react";
import { RefContext } from "@/providers/client-ref-provider";
import {
  PenBox,
  PenOff,
  PlusCircleIcon,
  RotateCw,
  SaveIcon,
} from "lucide-react";
import PrintButton from "@/components/buttons/print-button";
import MailButton from "@/components/buttons/mail-button";
import { useMonthDays } from "@/providers/month-days-provider";
import { MonthDaysCells } from "@/components/table/month-days-cells";

export default function ScheduleTableHeader({
  addNewRow,
  selectedDay,
  setSelectedDay,
  setIsEdit,
  isEdit,
  tab,
}: {
  addNewRow: () => void;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  setIsEdit?: (isEdit: boolean) => void;
  isEdit: boolean;
  tab: string;
}) {
  const { monthDays, month } = useMonthDays();

  const todayDay = new Date().getDate();

  const ref = useContext(RefContext);

  return (
    <TableHeader>
      <TableRow>
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
        <TableCell className="px-3  w-26">
          <div className="flex justify-between">
            <span className="text-base">{month?.toUpperCase() || ""}</span>
            <button
              type="button"
              onClick={() => setSelectedDay && setSelectedDay(todayDay)}
              className={selectedDay === todayDay ? "hidden" : "cursor-pointer"}
            >
              <RotateCw className="h-4 w-4 text-rd font-bold" />
            </button>
          </div>
        </TableCell>

        <MonthDaysCells
          monthDays={monthDays}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          orientation="top"
          clasName="w-9"
        />

        <TableCell className="w-4 p-0" />
      </TableRow>
    </TableHeader>
  );
}
