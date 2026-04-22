"use client";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { defaultVacationPay } from "./schema";
import TextInput from "@/components/input-controlled/text-input";
import { DatePickerRange } from "@/components/input-controlled/date-range-input";
import { Label } from "@/components/ui/label";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";

export default function VacationForm() {
  const t = useTranslations("Home");

  const nameTag = "vacationPay";
  const form = useFormContext();
  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: nameTag,
  });
  const vacationPayValues = useWatch({
    control: form.control,
    name: nameTag,
  });
  return (
    <div>
      <Label className="mb-2">{t("usedVacationDays")}</Label>
      <div className="flex flex-col gap-6">
        {fields.map((field, index) => {
          const startDate = vacationPayValues?.[index]?.startDate;
          const endDate = vacationPayValues?.[index]?.endDate;
          return (
            <div key={field.id} className="flex flex-col  gap-4">
              <div className="flex w-full">
                <DatePickerRange
                  value={{
                    from: startDate ? new Date(startDate) : undefined,
                    to: endDate ? new Date(endDate) : undefined,
                  }}
                  onDataChange={(range) => {
                    if (range?.from && range?.to) {
                      const diffTime = Math.abs(
                        range.to.getTime() - range.from.getTime(),
                      );
                      const diffDays =
                        Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                      form.setValue(
                        `vacationPay.${index}.startDate`,
                        range.from.toISOString(),
                      );
                      form.setValue(
                        `vacationPay.${index}.endDate`,
                        range.to.toISOString(),
                      );
                      form.setValue(
                        `vacationPay.${index}.countDays`,
                        diffDays.toString(),
                      );
                    }
                  }}
                  resetTrigger={false}
                  className="flex-1 h-10"
                />
                <TextInput
                  fieldName={`vacationPay.${index}.countDays`}
                  className="flex-none w-11 p-0 h-10 text-center mx-4"
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
                  <Trash />
                </Button>
              </div>
            </div>
          );
        })}
        <div className="flex justify-end">
          <Button
            type="button"
            className="h-10 w-10 flex-none"
            onClick={() => append(defaultVacationPay)}
          >
            <Plus />
          </Button>
        </div>
      </div>
    </div>
  );
}
