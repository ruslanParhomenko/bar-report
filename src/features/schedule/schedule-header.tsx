"use client";
import AddRowButton from "@/components/buttons/add-row-button";
import EditButton from "@/components/buttons/edit-button";
import MailButton from "@/components/buttons/mail-button";
import PrintButton from "@/components/buttons/print-button";
import ResetButton from "@/components/buttons/reset-button";
import SaveButton from "@/components/buttons/save-button";
import { MonthDaysCells } from "@/components/table/month-days-cells";
import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useAbility } from "@/providers/ability-provider";
import { RefContext } from "@/providers/client-ref-provider";
import { useMonthDays } from "@/providers/month-days-provider";
import { useContext } from "react";

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
  setIsEdit: (isEdit: boolean) => void;
  isEdit: boolean;
  tab: string;
}) {
  const { isAdmin } = useAbility();
  const { monthDays, month } = useMonthDays();

  const todayDay = new Date().getDate();

  const ref = useContext(RefContext);

  const resetSelectedDay = () => {
    setSelectedDay(todayDay);
  };

  return (
    <TableHeader>
      <TableRow>
        <TableCell colSpan={6} className="sticky left-0 w-42">
          <div className="flex gap-1 md:justify-center md:gap-3">
            <EditButton
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              disabled={!isAdmin}
            />
            <PrintButton componentRef={ref} disabled={isEdit} />

            <MailButton componentRef={ref} disabled={isEdit} patch={tab} />
            <AddRowButton
              isEdit={isEdit}
              addNewRow={addNewRow}
              disabled={!isEdit}
            />
            <SaveButton isEdit={isEdit} disabled={!isEdit} />
          </div>
        </TableCell>
        <TableCell className="w-26 px-3">
          <div className="flex justify-between">
            <span className="text-base">{month?.toUpperCase() || ""}</span>
            <ResetButton
              reset={resetSelectedDay}
              className={todayDay === selectedDay ? "hidden" : ""}
            />
          </div>
        </TableCell>

        <MonthDaysCells
          monthDays={monthDays}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          orientation="top"
          className="w-9"
        />

        <TableCell className="w-4 p-0" />
      </TableRow>
    </TableHeader>
  );
}
