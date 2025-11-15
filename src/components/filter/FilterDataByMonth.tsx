import SelectField from "@/components/inputs/SelectField";
import TextInput from "@/components/inputs/TextInput";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAbility } from "@/providers/AbilityProvider";
import { MONTHS, YEAR } from "@/utils/getMonthDays";
import { useTranslations } from "next-intl";

export function FilterDataByMonth({
  withButton = false,
  disabled = true,
}: {
  withButton?: boolean;
  disabled?: boolean;
}) {
  const t = useTranslations("Home");
  const { isAdmin } = useAbility();
  const isMobile = useIsMobile();
  const orientation = isMobile ? "vertical" : "horizontal";

  const classNameBid =
    "md:w-18 p-1 h-8 border-0 shadow-none md:text-xs text-[9px]";
  return (
    <div className="flex flex-col md:flex-row justify-between pb-2 text-bl">
      <div className="flex gap-4 items-center">
        <SelectField
          fieldName="month"
          data={MONTHS}
          placeHolder="month"
          className="w-24 p-0 h-8! border-bl justify-center"
          disabled={disabled}
        />
        <SelectField
          fieldName="year"
          data={YEAR}
          placeHolder="year"
          className="w-20 p-0 h-8! border-bl justify-center"
          disabled={disabled}
        />
        {withButton && (
          <Button
            type="submit"
            className="w-20 p-1 text-xs"
            size="sm"
            disabled={disabled}
          >
            {t("save")}
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <TextInput
          fieldName="waitersDishBid"
          className={classNameBid}
          fieldLabel={isMobile ? "" : "waiters %"}
          orientation={orientation}
          disabled={!isAdmin}
        />
        <TextInput
          fieldName="barmenDishBid"
          className={classNameBid}
          fieldLabel={isMobile ? "" : "barmen %"}
          orientation={orientation}
          disabled={!isAdmin}
        />
        <TextInput
          fieldName="dishDishBid"
          className={classNameBid}
          fieldLabel={isMobile ? "" : "dish %"}
          orientation={orientation}
          disabled={!isAdmin}
        />
        <TextInput
          fieldName="percentTips"
          className={classNameBid}
          fieldLabel={isMobile ? "" : "% tips"}
          orientation={orientation}
          disabled={!isAdmin}
        />
        <TextInput
          fieldName="percentBarmen"
          className={classNameBid}
          fieldLabel={isMobile ? "" : "% barmen"}
          orientation={orientation}
          disabled={!isAdmin}
        />
        <TextInput
          fieldName="percentDish"
          className={classNameBid}
          fieldLabel={isMobile ? "" : "% dish"}
          orientation={orientation}
          disabled={!isAdmin}
        />
      </div>
    </div>
  );
}
