"use client";
import {
  FieldPath,
  useFieldArray,
  UseFormReturn,
  useWatch,
} from "react-hook-form";

import { AddRemoveFieldsButton } from "@/components/buttons/action-fields";
import NumericInput from "@/components/input-controlled/numeric-input";
import SelectField from "@/components/input-controlled/select-field";
import SelectFieldWithSearch from "@/components/input-form/select-with-search";
import { Label } from "@/components/ui/label";
import { formatNow } from "@/utils/format-date";
import { Separator } from "@radix-ui/react-separator";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { TablesConfigItem } from "../config/tables-config";
import { ReportKitchenForm } from "../model/schema";

type RenderEmployeesTableProps = TablesConfigItem & {
  form: UseFormReturn<ReportKitchenForm>;
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
}: RenderEmployeesTableProps) => {
  const t = useTranslations("ReportKitchen");
  const { fieldName, weight, time, shift, over, reason } = placeHolder;
  const fieldsArray = useFieldArray({ control: form.control, name: name });
  const fieldsValues = useWatch({
    control: form.control,
    name: name,
  });

  useEffect(() => {
    if (fieldsValues.length === 0) return;
    fieldsValues?.forEach((item, idx) => {
      if ("product" in item && "time" in item && item?.product && !item?.time) {
        form.setValue(
          `${name}.${idx}.time` as FieldPath<ReportKitchenForm>,
          formatNow(),
          { shouldDirty: true },
        );
      }
    });
  }, [fieldsValues, form]);

  return (
    <div className="w-full pb-4">
      <Label className="text-bl/70 mb-1 px-2 text-xs">
        {t(name as string)} :
      </Label>
      <Separator className="bg-bl/30 p-[0.5px]" />

      {fieldsArray.fields.map((field, index) => {
        const currentValue = fieldsValues?.[index];
        const existProduct =
          !!currentValue && "product" in currentValue && currentValue.product;
        const existEmployees =
          !!currentValue &&
          "employees" in currentValue &&
          currentValue.employees;

        const viewAction = existProduct || existEmployees;

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
                  className="border-bl/40 h-6 w-40 cursor-pointer text-sm"
                />
                {"-"}
                {shift && dataShifts && (
                  <SelectField
                    fieldName={`${name}.${index}.${shift}`}
                    data={dataShifts}
                    className="border-bl/40 h-6! w-15 justify-center md:w-25"
                  />
                )}

                {(weight || over) && (
                  <NumericInput
                    fieldName={`${name}.${index}.${weight}`}
                    className="border-bl/40 h-6 w-15 font-medium md:w-25"
                  />
                )}
                {reason && dataReasons && (
                  <SelectField
                    fieldName={`${name}.${index}.${reason}`}
                    placeHolder="причина"
                    data={dataReasons}
                    className="border-bl/40 h-6! w-15 justify-center md:w-25"
                  />
                )}
              </div>
              <div className="flex items-center justify-center px-4 text-xs text-red-600">
                {time &&
                  fieldsValues?.[index] &&
                  "time" in fieldsValues[index] &&
                  fieldsValues[index].time}
              </div>
            </div>
            <div className="md:px-4">
              {viewAction && (
                <AddRemoveFieldsButton
                  formField={fieldsArray}
                  defaultValues={defaultValue}
                  index={index}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RenderTableCucina;
