import SelectField from "@/components/inputs/SelectField";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import { MONTHS } from "@/utils/getMonthDays";
import { ROLE_EMPLOYEES } from "../constants";

export default function SheduleSelectButtons({
  form,
  addNewRow,
  resetForm,
}: {
  form: UseFormReturn<any>;
  addNewRow: () => void;
  resetForm: () => void;
}) {
  const t = useTranslations("Home");
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
