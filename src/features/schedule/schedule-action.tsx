"use client";
import { isCanEdit } from "./utils";
import PrintButton from "@/components/buttons/print-button";
import EditButton from "@/components/buttons/edit-button";
import MailButton from "@/components/buttons/mail-button";
import { PlusCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useContext } from "react";
import { RefContext } from "@/providers/client-ref-provider";
import { PageParams } from "@/types/params";

export default function ScheduleActionButton({
  addNewRow,
  scheduleId,
  isSave,
  params,
}: {
  addNewRow?: () => void;
  scheduleId: string | undefined;
  isSave?: boolean;
  params: PageParams;
}) {
  const { month, year, tab } = params;

  const urlEdit = `schedule/${scheduleId}?month=${month}&year=${year}&tab=${tab}`;
  const urlCreate = `schedule/create?month=${month}&year=${year}&tab=${tab}`;
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
    </div>
  );
}
