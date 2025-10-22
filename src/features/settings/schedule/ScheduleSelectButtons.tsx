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

export default function ScheduleSelectButtons() {
  const t = useTranslations("Home");
  const form = useFormContext();
  const { isAdmin, isMngr } = useAbility();
  const isDisabled = !isAdmin && !isMngr;

  const rowShiftsArray = useFieldArray({
    control: form.control,
    name: "rowShifts",
  });

  const month = form.watch("month");
  const year = form.watch("year");
  const role = form.watch("role");

  const monthDays = useMemo(() => {
    if (!month || !year) return [];
    return getMonthDays({ month, year });
  }, [month, year]);

  const storageKey = useMemo(() => {
    if (!month || !role || !year) return null;
    return `schedule_${year}_${month}_${role}`;
  }, [year, month, role]);
  const resetForm = () => {
    form.reset(defaultSchedule);
    if (storageKey) localStorage.removeItem(storageKey);
  };
  const addNewRow = () => {
    const newRow = {
      id: Date.now().toString(),
      number: rowShiftsArray.fields.length + 1,
      dayHours: "",
      nightHours: "",
      totalHours: "",
      employee: "",
      shifts: Array(monthDays.length).fill(""),
    };
    rowShiftsArray.append(newRow);
  };
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
      <div className="flex justify-between items-center gap-1">
        <SelectField
          fieldName="month"
          data={MONTHS}
          placeHolder="month"
          className="w-25"
        />
        <SelectField
          fieldName="role"
          data={ROLE_EMPLOYEES}
          placeHolder="role"
          className="w-25"
          disabled={!month}
        />
        <input
          {...form.register("year")}
          type="text"
          className="w-10 px-1 text-xs"
          placeholder="year"
        />
        <Button type="submit" className="w-25" disabled={isDisabled}>
          {t("save")}
        </Button>
      </div>
      <div className="flex justify-between md:justify-end w-full gap-2">
        <Button onClick={addNewRow} size="sm" type="button">
          <Plus className="h-4 w-4 mr-2" />
          {t("add")}
        </Button>
        <Button variant="outline" size="sm" type="button" onClick={resetForm}>
          <RotateCcw className="h-4 w-4 mr-2" />
          {t("reset")}
        </Button>
      </div>
    </div>
  );
}
