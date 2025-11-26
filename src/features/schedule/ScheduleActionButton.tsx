import { toast } from "sonner";
import { isCanEdit } from "./utils";
import { FolderPlus, MailIcon, PencilIcon } from "lucide-react";
import PrintButton from "@/components/buttons/PrintButton";
import { useAbility } from "@/providers/AbilityProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ScheduleActionButton({
  handlePrint,
  sendScreenshot,
  isSending,
  patch,
  scheduleId,
}: {
  handlePrint: () => void;
  sendScreenshot: () => void;
  isSending: boolean;
  patch: string;
  scheduleId: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const month = params.get("month") as string;
  const year = params.get("year") as string;
  const { isAdmin, isManager } = useAbility();
  const isDisabled = !isAdmin && !isManager;
  const canEdit = isCanEdit({ year, month }) || isAdmin;
  return (
    <div className="flex md:gap-4 gap-1 py-3">
      {scheduleId ? (
        <>
          <Button
            size="sm"
            variant="outline"
            type="button"
            onClick={() => {
              if (canEdit) {
                router.push(
                  `/schedule/${patch}/${scheduleId}?month=${encodeURIComponent(
                    month
                  )}&year=${encodeURIComponent(year)}`
                );
              } else {
                toast.error("Редактирование недоступно: прошло более 41 дня");
              }
            }}
            disabled={isDisabled}
            className="cursor-pointer p-0"
          >
            <PencilIcon className="h-3 w-3" />
          </Button>
          <PrintButton onPrint={() => handlePrint && handlePrint()} />
          <Button
            size="sm"
            variant="outline"
            type="button"
            onClick={() => sendScreenshot && sendScreenshot()}
            disabled={isDisabled || isSending}
            className="cursor-pointer"
          >
            <MailIcon className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <Button
          size="sm"
          type="button"
          variant="outline"
          onClick={() =>
            router.push(
              `/schedule/${patch}/create?month=${encodeURIComponent(
                month
              )}&year=${encodeURIComponent(year)}`
            )
          }
          disabled={isDisabled}
          className="cursor-pointer p-0"
        >
          <FolderPlus className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
