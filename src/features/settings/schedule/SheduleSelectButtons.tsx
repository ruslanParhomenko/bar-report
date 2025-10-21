import SelectField from "@/components/inputs/SelectField";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFieldArray, useFormContext, UseFormReturn } from "react-hook-form";
import { getMonthDays, MONTHS } from "@/utils/getMonthDays";
import { ROLE_EMPLOYEES } from "../constants";
import { useMemo } from "react";
import { defaultSchedule } from "./schema";

export default function SheduleSelectButto() {
  const t = useTranslations("Home");
  const form = useFormContext();

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
    <div className="flex flex-col md:flex-row items-center justify-between gap-2">
      <div className="flex justify-between w-full items-center gap-4">
        <SelectField
          fieldName="role"
          data={ROLE_EMPLOYEES}
          placeHolder="role"
          className="w-30 md:w-50"
        />
        <SelectField
          fieldName="month"
          data={MONTHS}
          placeHolder="month"
          className="w-30 md:w-50"
        />
        <input
          {...form.register("year")}
          type="text"
          className="w-15 md:w-20 p-1"
          placeholder="year"
        />
      </div>
      <div className="flex justify-end w-full gap-2">
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
