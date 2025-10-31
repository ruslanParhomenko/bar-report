import SelectField from "@/components/inputs/SelectField";
import { Button } from "@/components/ui/button";
import { MONTHS, YEAR } from "@/utils/getMonthDays";
import { useTranslations } from "next-intl";

export default function FilterHeader({ isDisabled }: { isDisabled?: boolean }) {
  const t = useTranslations("Home");
  return (
    <div className="flex justify-between md:justify-start items-center gap-2 md:gap-6 py-4">
      <SelectField
        fieldName="month"
        data={MONTHS}
        placeHolder="month"
        className="w-20 p-1 text-xs"
        disabled={isDisabled}
      />

      <SelectField
        fieldName="year"
        data={YEAR}
        className="w-20 text-xs h-8"
        placeHolder="year"
      />

      <Button
        type="submit"
        className="w-20 p-1 text-xs"
        size="sm"
        disabled={isDisabled}
      >
        {t("save")}
      </Button>
    </div>
  );
}
