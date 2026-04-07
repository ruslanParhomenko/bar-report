"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import NumericInput from "@/components/inputs-form/numeric-input";
import SelectField from "@/components/inputs-form/select-input";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import { formatNow } from "@/utils/format-date";
import { ExpensesSchemaType } from "./schema";
import { RECIPIENTS } from "./constants";

export default function TableExpenses({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  const { control, setValue } = useFormContext();

  const reset = (idx: number) => {
    setValue(
      `report.expenses.${idx}`,
      {
        name: "",
        sum: "",
        time: "",
      },
      { shouldDirty: true, shouldTouch: true },
    );
  };
  const fieldsValues = useWatch({
    name: "report.expenses",
    control,
  }) as ExpensesSchemaType[];

  const { fields } = useFieldArray({
    control,
    name: "report.expenses",
  });

  useEffect(() => {
    fieldsValues?.forEach((item, idx) => {
      if (item?.sum && item?.name && !item?.time) {
        setValue(`report.expenses.${idx}.time`, formatNow(), {
          shouldDirty: true,
        });
      }
    });
  }, [fieldsValues]);

  return (
    <Table className="md:table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="w-16 font-bold text-bl">Expenses</TableHead>
          <TableHead className="w-11" />
          <TableHead className="w-11" />
          <TableHead className="w-8" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {fields?.map((item, idx: number) => (
          <TableRow key={item.id}>
            <TableCell>
              <SelectField
                data={RECIPIENTS}
                fieldName={`report.expenses.${idx}.name`}
                className="w-full h-8!  border-0! shadow-none text-sm! font-medium!"
                placeHolder="..."
                disabled={disabled}
              />
            </TableCell>
            <TableCell>
              <NumericInput
                fieldName={`report.expenses.${idx}.sum`}
                className="w-14! text-center"
                disabled={disabled}
              />
            </TableCell>
            <TableCell className="text-xs text-rd">
              {fieldsValues?.[idx]?.time}
            </TableCell>
            <TableCell
              onClick={() => !disabled && reset(idx)}
              className="cursor-pointer"
            >
              {fieldsValues?.[idx]?.name && (
                <Trash2Icon className="w-4 h-4 text-rd" />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
