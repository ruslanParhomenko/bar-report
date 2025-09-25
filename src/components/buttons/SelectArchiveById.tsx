import { useTranslations } from "next-intl";
import SelectInput from "../inputs/SelectInput";
import { Button } from "../ui/button";
import { useAbility } from "@/providers/AbilityProvider";
import { Label } from "../ui/label";
import { useFormContext } from "react-hook-form";

export default function SelectArchiveById({
  dataSelect,
  nameTag,
}: {
  dataSelect: { label: string; value: string }[];
  nameTag: string;
}) {
  const { isObserver } = useAbility();
  const t = useTranslations("Home");

  const { setValue } = useFormContext();
  return (
    <div className="md:w-1/4 w-full py-4 flex items-center gap-2" key={nameTag}>
      {isObserver ? (
        <Label className="text-muted-foreground">
          {t("insufficientRights")}
        </Label>
      ) : (
        <>
          <div className="flex gap-4 w-full">
            <SelectInput
              fieldName={`selectDataId_${nameTag}`}
              data={dataSelect}
              placeHolder={t("chooseItem")}
              className="w-full"
            />

            <Button
              variant="outline"
              size="sm"
              className="w-24 h-9"
              onClick={() =>
                setValue && setValue(`selectDataId_${nameTag}`, null as any)
              }
            >
              {t("reset")}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
