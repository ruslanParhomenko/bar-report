"use client";
import { isCanEdit } from "./utils";
import PrintButton from "@/components/buttons/print-button";
import { useAbility } from "@/providers/ability-provider";
import { useRouter, useSearchParams } from "next/navigation";
import EditButton from "@/components/buttons/edit-button";
import MailButton from "@/components/buttons/mail-button";
import ExitButton from "@/components/buttons/exit-button";
import { PlusCircleIcon, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useContext } from "react";
import { RefContext } from "@/providers/client-ref-provider";

export default function ScheduleActionButton({
  addNewRow,
  scheduleId,
  isSave,
}: {
  addNewRow?: () => void;
  scheduleId: string;
  isSave?: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const month = params.get("month") as string;
  const year = params.get("year") as string;
  const tab = params.get("tab") as string;
  const { isAdmin, isManager } = useAbility();
  const isDisabled = !isAdmin && !isManager;
  const urlEdit = `schedule/${scheduleId}?month=${month}&year=${year}&tab=${tab}`;
  const urlCreate = `schedule/create?month=${month}&year=${year}&tab=${tab}`;
  const canEdit = isCanEdit({ year, month }) || isAdmin;

  const ref = useContext(RefContext);
  return (
    <div className="flex justify-center items-start  p-0 gap-3">
      <EditButton
        canEdit={canEdit}
        url={scheduleId ? urlEdit : urlCreate}
        disabled={isDisabled || isSave}
        className="text-bl"
      />

      <ExitButton disabled={!isSave} className="text-bl" />
      <PrintButton componentRef={ref} disabled={!ref} className="text-bl" />

      <MailButton
        componentRef={ref}
        disabled={isDisabled || !ref}
        patch={tab}
        className="text-bl"
      />
      <button
        type="submit"
        className={cn("cursor-pointer text-bl", ref && "opacity-50")}
        disabled={ref ? true : false}
      >
        <Save
          className={cn("h-5 w-5", !ref && "text-rd")}
          strokeWidth={ref ? 1.5 : 2}
        />
      </button>
      <button
        type="submit"
        onClick={addNewRow && addNewRow}
        className={cn("cursor-pointer text-bl", ref && "opacity-50")}
        disabled={ref ? true : false}
      >
        <PlusCircleIcon
          className={cn("h-5 w-5", !ref && "text-rd")}
          strokeWidth={ref ? 1.5 : 2}
        />
      </button>
    </div>
  );
}
