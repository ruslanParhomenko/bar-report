"use client";
import {
  ArrayPath,
  FieldPath,
  useFieldArray,
  UseFormReturn,
  useWatch,
} from "react-hook-form";

import { AddRemoveFieldsButton } from "@/components/buttons/action-fields";
import NumericInput from "@/components/input-controlled/numeric-input";
import SelectField from "@/components/input-controlled/select-field";
import SelectFieldWithSearch from "@/components/input-controlled/select-with-search";
import { Label } from "@/components/ui/label";
import { formatNow } from "@/utils/format-date";
import { Separator } from "@radix-ui/react-separator";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { ProductPreparedType, ReportCucinaInput } from "./schema";

type RenderEmployeesTableProps = {
  name: ArrayPath<ReportCucinaInput>;
  form: UseFormReturn<ReportCucinaInput>;
  placeHolder: {
    fieldName: string;
    weight?: string;
    shift?: string;
    over?: string;
    time?: string;
    reason?: string;
  };
  dataShifts?: string[] | null;
  dataReasons?: string[] | null;

  dataFieldArray?: string[] | null;

  defaultValue: {};
  isDisabled?: boolean;
};

const RenderTableCucina = ({
  name,
  form,
  placeHolder,
  dataShifts,
  dataReasons,
  dataFieldArray,
  defaultValue,
  isDisabled = false,
}: RenderEmployeesTableProps) => {
  const t = useTranslations("Home");
  const { fieldName, weight, time, shift, over, reason } = placeHolder;
  const fieldsArray = useFieldArray({ control: form.control, name: name });
  const fieldsValues = time
    ? (useWatch({
        control: form.control,
        name: name,
      }) as ProductPreparedType[])
    : [];

  useEffect(() => {
    if (fieldsValues.length === 0) return;
    fieldsValues?.forEach((item, idx) => {
      if (item?.product && !item?.time) {
        form.setValue(
          `${name}.${idx}.time` as FieldPath<ReportCucinaInput>,
          formatNow(),
          {
            shouldDirty: true,
          },
        );
      }
    });
  }, [fieldsValues, form]);

  return (
    <div className="pb-4">
      <Label className="text-bl mb-1">{t(name as string)} :</Label>
      <Separator className="bg-bl/40 p-[0.5px]" />

      {fieldsArray.fields.map((field, index) => {
        return (
          <div
            key={field.id}
            className="flex items-center justify-between pt-1"
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex w-full items-center justify-start gap-2 md:gap-8 md:px-6">
                <SelectFieldWithSearch
                  fieldName={`${name}.${index}.${fieldName}`}
                  data={dataFieldArray || []}
                  className="border-bl/40 h-7 w-40 cursor-pointer text-sm"
                  disabled={isDisabled}
                />
                {":"}
                {shift && dataShifts && (
                  <SelectField
                    fieldName={`${name}.${index}.${shift}`}
                    data={dataShifts}
                    className="border-bl/40 h-7! w-15 justify-center md:w-25"
                    disabled={isDisabled}
                  />
                )}

                {(weight || over) && (
                  <NumericInput
                    fieldName={`${name}.${index}.${weight}`}
                    className="border-bl/40 h-7 w-15 md:w-25"
                    disabled={isDisabled}
                  />
                )}
                {reason && dataReasons && (
                  <SelectField
                    fieldName={`${name}.${index}.${shift}`}
                    placeHolder="причина"
                    data={dataReasons}
                    className="border-bl/40 h-7! w-15 justify-center md:w-25"
                    disabled={isDisabled}
                  />
                )}
              </div>
              <div className="flex items-center justify-center px-4 text-sm text-red-600">
                {time && fieldsValues?.[index]?.time}
              </div>
            </div>
            <div className="md:px-4">
              <AddRemoveFieldsButton
                formField={fieldsArray}
                defaultValues={defaultValue}
                index={index}
                disabled={isDisabled}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RenderTableCucina;
