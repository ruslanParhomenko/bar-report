"use client";
import { isCanEdit } from "./utils";
import PrintButton from "@/components/buttons/print-button";
import EditButton from "@/components/buttons/edit-button";
import MailButton from "@/components/buttons/mail-button";
import { PlusCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useContext } from "react";
import { RefContext } from "@/providers/client-ref-provider";
import { ValueParams } from "@/types/params";
import ExitButton from "@/components/buttons/exit-button";

export default function ScheduleActionButton({
  addNewRow,
  scheduleId,
  isSave,
  params,
  tab,
}: {
  addNewRow?: () => void;
  scheduleId: string | undefined;
  isSave?: boolean;
  params: ValueParams;
  tab: string;
}) {
  const { month, year } = params;

  const urlEdit = `schedule/${scheduleId}?month=${month}&year=${year}#tab=${tab}`;
  const urlCreate = `schedule/create?month=${month}&year=${year}#tab=${tab}`;
  const returnUrl = `schedule?month=${month}&year=${year}#tab=${tab}`;
  const canEdit = isCanEdit({ year, month });

  const ref = useContext(RefContext);

  return (
    <div className="flex justify-center items-start  p-0 gap-3">
      <EditButton
        canEdit={canEdit}
        url={scheduleId ? urlEdit : urlCreate}
        className="text-bl"
      />
      <PrintButton componentRef={ref} disabled={isSave} className="text-bl" />

      <MailButton
        componentRef={ref}
        disabled={isSave!}
        patch={tab}
        className="text-bl"
      />
      <button
        type="button"
        onClick={addNewRow && addNewRow}
        className={cn("cursor-pointer text-bl", !isSave && "opacity-50")}
        disabled={!isSave}
      >
        <PlusCircleIcon
          className={cn("h-5 w-5", isSave && "text-rd")}
          strokeWidth={ref ? 1.5 : 2}
        />
      </button>
      <ExitButton className="text-bl" />
    </div>
  );
}
