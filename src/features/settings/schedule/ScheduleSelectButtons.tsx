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
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 py-4">
      <div className="flex justify-between items-center gap-1">
        <SelectField
          fieldName="month"
          data={MONTHS}
          placeHolder="month"
          className="w-25"
          disabled={!!id}
        />
        <SelectField
          fieldName="role"
          data={ROLE_EMPLOYEES}
          placeHolder="role"
          className="w-25"
          disabled={!month || !!id}
        />
        <input
          {...form.register("year")}
          type="text"
          className="w-10 px-1 text-xs"
          placeholder="year"
          disabled={!!id}
        />
        <Button type="submit" className="w-25" disabled={isDisabled}>
          {t("save")}
        </Button>
        <Button
          onClick={() => {
            router.back(), resetForm;
          }}
          variant="outline"
          type="button"
          className="w-25 text-rd cursor-pointer"
          disabled={isDisabled}
        >
          {t("exit")}
        </Button>
      </div>
      <div className="flex justify-between md:justify-end w-full gap-2">
        <Button
          onClick={addNewRow}
          size="sm"
          type="button"
          className="cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("add")}
        </Button>
        <Button variant="outline" size="sm" type="button" onClick={resetForm}>
          <RotateCcw className="h-4 w-4 mr-2 cursor-pointer" />
          {t("reset")}
        </Button>
      </div>
    </div>
  );
}
