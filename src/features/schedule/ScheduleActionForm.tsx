import PrintButton from "@/components/buttons/PrintButton";
import SelectField from "@/components/inputs/SelectField";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { useAbility } from "@/providers/AbilityProvider";
import { MONTHS, YEAR } from "@/utils/getMonthDays";
import { FolderPlus, MailIcon, PencilIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

export function ScheduleActionForm({
  isView = false,
  handlePrint,
  sendScreenshot,
  isSending,
  isCreate = false,
  id,
  month,
  year,
}: {
  isView?: boolean;
  handlePrint?: () => void;
  sendScreenshot?: () => void;
  isSending?: boolean;
  isCreate?: boolean;
  id?: string;
  month: string;
  year: string;
}) {
  const { patch } = useParams();
  const router = useRouter();
  const { isAdmin, isManager } = useAbility();
  const isDisabled = !isAdmin && !isManager;

  const { watch } = useFormContext();
  const formMonth = watch("month");
  const formYear = watch("year");

  const currentYear = new Date().getFullYear().toString();
  const currentMonth = MONTHS[new Date().getMonth()];

  const handleEditClick = () => {
    const monthIndex = MONTHS.indexOf(month);
    const editDate = new Date(parseInt(year), monthIndex, 1);

    const currentDate = new Date();

    const diffTime = currentDate.getTime() - editDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    const canEdit =
      isAdmin ||
      (diffDays <= 41 &&
        ((month === currentMonth && year === currentYear) ||
          (MONTHS.indexOf(month) === MONTHS.indexOf(currentMonth) - 1 &&
            year === currentYear) ||
          (currentMonth === MONTHS[0] &&
            month === MONTHS[11] &&
            year === (parseInt(currentYear) - 1).toString())));

    if (canEdit) {
      router.push(
        `/schedule/${patch}/${id}?month=${encodeURIComponent(
          formMonth
        )}&year=${encodeURIComponent(formYear)}`
      );
    } else {
      toast.error(
        "Редактирование недоступно: прошло более 45 дней или не текущий/предыдущий месяц"
      );
    }
  };

  return (
    <div className="flex justify-between items-center md:px-4 py-4">
      <div className="flex md:gap-4 gap-1">
        <SelectField
          fieldName="month"
          data={MONTHS}
          placeHolder="month"
          className="w-24 justify-center"
        />
        <SelectField
          fieldName="year"
          data={YEAR}
          placeHolder="year"
          className="w-24 justify-center"
        />
        {isCreate && (
          <Button
            size={"sm"}
            type="button"
            variant={"outline"}
            onClick={() =>
              router.push(
                `/schedule/${patch}/create?month=${encodeURIComponent(
                  formMonth
                )}&year=${encodeURIComponent(formYear)}`
              )
            }
            disabled={isDisabled}
            className="cursor-pointer p-0"
          >
            <FolderPlus className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isView && (
        <div className="flex md:gap-4 gap-1">
          <Button
            size={"sm"}
            type="button"
            variant={"outline"}
            onClick={handleEditClick}
            disabled={isDisabled}
            className="cursor-pointer p-0"
          >
            <PencilIcon className="h-3 w-3" />
          </Button>
          <PrintButton onPrint={() => handlePrint && handlePrint()} />
          <Button
            size={"sm"}
            type="button"
            variant={"outline"}
            onClick={() => sendScreenshot && sendScreenshot()}
            disabled={isDisabled || isSending}
            className="cursor-pointer"
          >
            <MailIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
