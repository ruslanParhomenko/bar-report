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
    field1: string;
    field2: string;
    field3: string;
    field4?: string;
  };

  dataArrayField1?: string[] | null;
  dataArrayField2?: string[] | null;
  dataArrayField3?: string[] | null;
  defaultValue: {};
  isDisabled?: boolean;
};

const RenderTableCucina = ({
  name,
  form,
  placeHolder,
  dataArrayField1,
  dataArrayField2,
  dataArrayField3,
  defaultValue,
  isDisabled = false,
}: RenderEmployeesTableProps) => {
  const t = useTranslations("Home");
  const { field1, field2, field3, field4 } = placeHolder;
  const fieldsArray = useFieldArray({ control: form.control, name: name });
  const fieldsValues = field4
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
      <Label className="text-bl">{t(name as string)} :</Label>
      <Separator className="p-[0.5px] bg-bl" />

      {fieldsArray.fields.map((field, index) => {
        return (
          <div key={field.id} className="grid  grid-cols-[88%_12%] mt-1">
            <div className="grid grid-cols-[40%_20%_20%_15%] gap-2 md:gap-6">
              <SelectFieldWithSearch
                placeHolder=".........."
                fieldName={`${name}.${index}.${field1}`}
                data={dataArrayField1 || []}
                className="cursor-pointer h-7 w-40 text-sm"
                disabled={isDisabled}
              />
              {field2 && dataArrayField2 ? (
                <SelectFieldWithSearch
                  fieldName={`${name}.${index}.${field2}`}
                  data={dataArrayField2}
                  placeHolder={"смена"}
                  className="justify-center h-7  text-sm"
                  disabled={isDisabled}
                />
              ) : (
                <NumericInput
                  fieldName={`${name}.${index}.${field2}`}
                  placeholder="..."
                  className="text-sm w-30 h-7"
                  disabled={isDisabled}
                />
              )}
              {field3 && dataArrayField3 ? (
                <SelectField
                  fieldName={`${name}.${index}.${field3}`}
                  data={dataArrayField3}
                  placeHolder={field3 ? t(field3) : ""}
                  className="justify-center text-muted-foreground w-30 h-7!"
                  disabled={isDisabled}
                />
              ) : (
                <NumericInput
                  fieldName={`${name}.${index}.${field3}`}
                  placeholder="...вес"
                  className="text-muted-foreground w-30 "
                  disabled={isDisabled}
                />
              )}
              <div className="text-sm text-red-600 flex items-center justify-center md:w-10 w-7 h-7">
                {field4 && fieldsValues?.[index]?.time}
              </div>
            </div>

            <AddRemoveFieldsButton
              formField={fieldsArray}
              defaultValues={defaultValue}
              index={index}
              disabled={isDisabled}
            />
          </div>
        );
      })}
    </div>
  );
};

export default RenderTableCucina;
