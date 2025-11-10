import SelectField from "@/components/inputs/SelectField";
import TextInput from "@/components/inputs/TextInput";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import DatePickerInput from "@/components/inputs/DatePickerInput";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { DatePickerRange } from "@/components/inputs/DatePickerRange";
import { defaultEmployee, defaultVacationPay, EMPLOYEES_ROLE } from "./schema";

export default function CardFormEmployees({
  nameTag,
  disabled,
}: {
  nameTag: string;
  disabled?: boolean;
}) {
  const t = useTranslations("Home");
  const form = useFormContext();
  const { id } = form.getValues();
  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: nameTag,
  });
  const vacationPayValues = useWatch({
    control: form.control,
    name: nameTag,
  });

  return (
    <Card className="h-[80vh] flex flex-col overflow-hidden">
      <CardContent className="flex-1 pt-4 overflow-y-auto">
        <Label className="text-base font-bold">{t("name")}</Label>
        <TextInput fieldName="name" type="text" className="w-full my-2 h-10" />
        <Label className="text-base font-bold">{t("role")}</Label>
        <SelectField
          data={EMPLOYEES_ROLE}
          fieldName="role"
          className="truncate w-full my-2 h-10"
        />
        <Label className="text-base font-bold">{t("rate")}</Label>
        <TextInput fieldName="rate" className="my-2" />
        <Label className="text-base font-bold">{t("mail")}</Label>
        <TextInput fieldName="mail" type="mail" className="w-full my-2 h-10" />
        <Label className="text-base font-bold">{t("employmentDate")}</Label>
        <DatePickerInput
          fieldName="employmentDate"
          className="my-2 w-full h-10"
        />

        <Label className="font-bold text-base">{t("usedVacationDays")}</Label>

        {fields.map((field, index) => {
          const startDate = vacationPayValues?.[index]?.startDate;
          const endDate = vacationPayValues?.[index]?.endDate;
          return (
            <div key={field.id} className="flex flex-col gap-4 w-full my-1">
              <div className="flex w-full gap-4">
                <DatePickerRange
                  value={{
                    from: startDate ? new Date(startDate) : undefined,
                    to: endDate ? new Date(endDate) : undefined,
                  }}
                  onDataChange={(range) => {
                    if (range?.from && range?.to) {
                      const diffTime = Math.abs(
                        range.to.getTime() - range.from.getTime()
                      );
                      const diffDays =
                        Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                      form.setValue(
                        `vacationPay.${index}.startDate`,
                        range.from.toISOString()
                      );
                      form.setValue(
                        `vacationPay.${index}.endDate`,
                        range.to.toISOString()
                      );
                      form.setValue(
                        `vacationPay.${index}.countDays`,
                        diffDays.toString()
                      );
                    }
                  }}
                  resetTrigger={false}
                  className="flex-1 h-10"
                />
                <TextInput
                  fieldName={`vacationPay.${index}.countDays`}
                  placeholder={t("days")}
                  className="flex-none w-15 h-10 text-center"
                />
                <Button
                  type="button"
                  variant="destructive"
                  className="h-10 w-10 flex-none"
                  onClick={() =>
                    fields.length === 1
                      ? replace(defaultVacationPay)
                      : remove(index)
                  }
                >
                  <Trash size={16} />
                </Button>
              </div>

              <div className="w-full flex justify-end">
                {fields.length - 1 === index && (
                  <Button
                    type="button"
                    onClick={() => append(defaultVacationPay)}
                  >
                    <Plus size={16} />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
      <CardFooter className="flex flex-row justify-between py-8">
        <Button
          className="cursor-pointer"
          type="button"
          variant={"secondary"}
          onClick={() => form.reset(defaultEmployee)}
        >
          {t("reset")}
        </Button>

        <Button type="submit" disabled={disabled}>
          {id ? (
            t("update")
          ) : (
            <>
              <Plus /> {t("add")}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
