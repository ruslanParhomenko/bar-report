"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import NumericInput from "@/components/input-controlled/numeric-input";
import SelectField from "@/components/input-controlled/select-field";
import { formatNow } from "@/utils/format-date";
import { Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { RECIPIENTS } from "./constants";
import { ExpensesSchemaType } from "./schema";

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
          <TableHead className="text-bl w-16 font-bold">Expenses</TableHead>
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
                className="h-8! w-full border-0! text-sm! font-medium! shadow-none"
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
            <TableCell className="text-rd text-xs">
              {fieldsValues?.[idx]?.time}
            </TableCell>
            <TableCell
              onClick={() => !disabled && reset(idx)}
              className="cursor-pointer"
            >
              {fieldsValues?.[idx]?.name && (
                <Trash2Icon className="text-rd h-4 w-4" />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
