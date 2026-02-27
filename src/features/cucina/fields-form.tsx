"use client";
import {
  ArrayPath,
  FieldPath,
  useFieldArray,
  UseFormReturn,
  useWatch,
} from "react-hook-form";

import SelectField from "@/components/inputs/select-input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { Separator } from "@radix-ui/react-separator";
import { ProductPreparedType, ReportCucinaType } from "./schema";
import SelectFieldWithSearch from "@/components/inputs/select-with-search";
import NumericInput from "@/components/inputs/numeric-input";
import { useEffect } from "react";
import { AddRemoveFieldsButton } from "@/components/buttons/action-fields";
import { formatNow } from "@/utils/format-date";

type RenderEmployeesTableProps = {
  name: ArrayPath<ReportCucinaType>;
  form: UseFormReturn<ReportCucinaType>;
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
          `${name}.${idx}.time` as FieldPath<ReportCucinaType>,
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
      <Separator className="p-[0.5px] bg-bl/40" />

      {fieldsArray.fields.map((field, index) => {
        console.log(field);
        return (
          <div
            key={field.id}
            className="flex justify-between items-center pt-1"
          >
            <div className="flex justify-between w-full items-center">
              <div className="flex justify-start md:gap-8 gap-2 md:px-6 w-full items-center">
                <SelectFieldWithSearch
                  fieldName={`${name}.${index}.${fieldName}`}
                  data={dataFieldArray || []}
                  className="cursor-pointer h-7 w-40  text-sm border-bl/40"
                  disabled={isDisabled}
                />
                {":"}
                {shift && dataShifts && (
                  <SelectField
                    fieldName={`${name}.${index}.${shift}`}
                    data={dataShifts}
                    className="justify-center md:w-25 w-15 h-7! border-bl/40"
                    disabled={isDisabled}
                  />
                )}

                {(weight || over) && (
                  <NumericInput
                    fieldName={`${name}.${index}.${weight}`}
                    className="md:w-25 w-15  h-7 border-bl/40"
                    disabled={isDisabled}
                  />
                )}
                {reason && dataReasons && (
                  <SelectField
                    fieldName={`${name}.${index}.${shift}`}
                    placeHolder="причина"
                    data={dataReasons}
                    className="justify-center md:w-25 w-15 h-7! border-bl/40"
                    disabled={isDisabled}
                  />
                )}
              </div>
              <div className="text-sm text-red-600 flex items-center justify-center px-4">
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
