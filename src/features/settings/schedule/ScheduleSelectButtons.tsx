import SelectField from "@/components/inputs/SelectField";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFieldArray, useFormContext } from "react-hook-form";
import { getMonthDays, MONTHS } from "@/utils/getMonthDays";
import { useMemo } from "react";
import { defaultSchedule } from "./schema";
import { useAbility } from "@/providers/AbilityProvider";
import { ROLE_EMPLOYEES } from "./constants";
import { useParams } from "next/navigation";

import { useRouter } from "@/i18n/navigation";

export default function ScheduleSelectButtons({
  addNewRow,
  remove,
}: {
  addNewRow: () => void;
  remove: () => void;
}) {
  const { id } = useParams();
  const router = useRouter();
  const t = useTranslations("Home");
  const form = useFormContext();
  const { isAdmin, isMngr } = useAbility();
  const isDisabled = !isAdmin && !isMngr;

  const month = form.watch("month");

  const resetForm = () => {
    form.reset(defaultSchedule);
    remove();
  };

  return (
    <div className="flex justify-between md:justify-start items-center gap-2 md:gap-6 py-4">
      <SelectField
        fieldName="month"
        data={MONTHS}
        placeHolder="month"
        className="w-16 p-1 text-xs"
        disabled={!!id}
      />
      <SelectField
        fieldName="role"
        data={ROLE_EMPLOYEES}
        placeHolder="role"
        className="w-18 p-1 text-xs"
        disabled={!month || !!id}
      />
      <input
        {...form.register("year")}
        type="text"
        className="w-10 text-xs h-8 hidden"
        placeholder="year"
        disabled={!!id}
      />
      <Button
        size="sm"
        onClick={() => {
          router.back(), resetForm;
        }}
        variant="outline"
        type="button"
        className="w-16 p-1 text-rd cursor-pointer text-xs"
        disabled={isDisabled}
      >
        {t("exit")}
      </Button>
      <Button
        className="cursor-pointer text-bl text-xs p-1"
        variant="outline"
        size="sm"
        type="button"
        onClick={resetForm}
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      <Button
        type="submit"
        className="w-20 p-1 text-xs"
        disabled={isDisabled}
        size="sm"
      >
        {t("save")}
      </Button>
    </div>
  );
}
