import { isCanEdit } from "./utils";
import PrintButton from "@/components/buttons/PrintButton";
import { useAbility } from "@/providers/AbilityProvider";
import { useSearchParams } from "next/navigation";
import EditButton from "@/components/buttons/EditButton";
import MailButton from "@/components/buttons/MailButton";
import ExitButton from "@/components/buttons/ExitButton";
import { is } from "date-fns/locale";
import { Save } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export default function ScheduleActionButton({
  ref,
  patch,
  scheduleId,
  isSave,
}: {
  ref?: React.RefObject<HTMLDivElement | null>;
  patch: string;
  scheduleId: string;
  isSave?: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const month = params.get("month") as string;
  const year = params.get("year") as string;
  const { isAdmin, isManager } = useAbility();
  const isDisabled = !isAdmin && !isManager;
  const urlEdit = `/schedule/${patch}/${scheduleId}?month=${month}&year=${year}`;
  const urlCreate = `/schedule/${patch}/create?month=${month}&year=${year}`;
  const canEdit = isCanEdit({ year, month }) || isAdmin;
  return (
    <div className="flex justify-center items-start md:gap-3 p-0 gap-1">
      <EditButton
        canEdit={canEdit}
        url={scheduleId ? urlEdit : urlCreate}
        disabled={isDisabled || isSave}
      />

      <ExitButton disabled={!isSave} />
      <PrintButton componentRef={ref && ref} disabled={!ref} />

      <MailButton
        componentRef={ref}
        disabled={isDisabled || !ref}
        patch={patch}
      />
      <button
        type="submit"
        onClick={() => router.back()}
        className={cn("cursor-pointer", ref && "opacity-50")}
        disabled={ref ? true : false}
      >
        <Save className="h-5 w-5" strokeWidth={1.5} />
      </button>
    </div>
  );
}
