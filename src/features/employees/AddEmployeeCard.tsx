import TextInput from "@/components/inputs/TextInput";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import DatePickerInput from "@/components/inputs/DatePickerInput";
import { Button } from "@/components/ui/button";
import { CircleMinus, Plus, Trash } from "lucide-react";
import { DatePickerRange } from "@/components/inputs/DatePickerRange";
import { defaultEmployee, defaultVacationPay, EMPLOYEES_ROLE } from "./schema";
import { cn } from "@/lib/utils";
import SelectInput from "@/components/inputs/SelectInput";

export function AddEmployeeCard({
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

  if (disabled) return null;
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden md:order-2 order-first w-full md:w-[20%] py-6"
      )}
    >
      <div className="flex-1 pt-4 overflow-y-auto">
        <TextInput
          fieldName="name"
          fieldLabel={t("name")}
          type="text"
          className="w-full h-8"
        />
        <SelectInput
          data={EMPLOYEES_ROLE}
          fieldName="role"
          fieldLabel={t("role")}
          className="truncate w-full h-8"
        />
        <TextInput
          fieldName="rate"
          fieldLabel={t("rate")}
          className="w-full h-8"
        />
        <TextInput
          fieldName="mail"
          fieldLabel={t("mail")}
          type="mail"
          className="w-full h-8"
        />
        <TextInput
          fieldName="tel"
          fieldLabel={t("tel")}
          type="tel"
          className="w-full h-8"
        />
        <Label className="pt-2">{t("employmentDate")}</Label>
        <DatePickerInput
          fieldName="employmentDate"
          className="w-full !h-8 !border-1 my-2"
        />

        <Label className="pt-4 pb-2">{t("usedVacationDays")}</Label>

        {fields.map((field, index) => {
          const startDate = vacationPayValues?.[index]?.startDate;
          const endDate = vacationPayValues?.[index]?.endDate;
          return (
            <div key={field.id} className="flex flex-col w-full gap-0">
              <div className="flex w-full gap-1">
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
                  className="flex-1 h-8 "
                />
                <TextInput
                  fieldName={`vacationPay.${index}.countDays`}
                  className="flex-none w-8 p-0 h-8 text-center"
                />
                <Button
                  type="button"
                  variant="destructive"
                  className="h-8 w-8 flex-none"
                  onClick={() =>
                    fields.length === 1
                      ? replace(defaultVacationPay)
                      : remove(index)
                  }
                >
                  <Trash />
                </Button>
              </div>
            </div>
          );
        })}
        <div className="w-full flex justify-end">
          <Button
            type="button"
            className="h-8 w-8 flex-none"
            onClick={() => append(defaultVacationPay)}
          >
            <Plus />
          </Button>
        </div>
      </div>
      <div className="flex flex-row justify-between py-4">
        <Button
          className="cursor-pointer h-8"
          type="button"
          variant={"secondary"}
          onClick={() => form.reset(defaultEmployee)}
        >
          {t("reset")}
        </Button>

        <Button className="h-8" type="submit" disabled={disabled}>
          {id ? (
            t("update")
          ) : (
            <>
              <Plus /> {t("add")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
