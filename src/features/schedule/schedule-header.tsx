"use client";
import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useContext } from "react";
import { RefContext } from "@/providers/client-ref-provider";
import PrintButton from "@/components/buttons/print-button";
import MailButton from "@/components/buttons/mail-button";
import { useMonthDays } from "@/providers/month-days-provider";
import { MonthDaysCells } from "@/components/table/month-days-cells";
import EditButton from "@/components/buttons/edit-button";
import { useAbility } from "@/providers/ability-provider";
import SaveButton from "@/components/buttons/save-button";
import AddRowButton from "@/components/buttons/add-row-button";
import ResetButton from "@/components/buttons/reset-button";

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
        <TableCell colSpan={6} className="w-42">
          <div className="flex justify-center items-start gap-3">
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
        <TableCell className="px-3  w-26">
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
          clasName="w-9"
        />

        <TableCell className="w-4 p-0" />
      </TableRow>
    </TableHeader>
  );
}
