"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import NumericInput from "@/components/inputs/numeric-input";
import SelectField from "@/components/inputs/select-input";
import { useFormContext, useWatch } from "react-hook-form";
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
          <TableHead className="w-18 font-bold text-bl">Expenses</TableHead>
          <TableHead className="w-11" />
          <TableHead className="w-11" />
          <TableHead className="w-8" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {fieldsValues?.map((_, idx: number) => (
          <TableRow key={idx}>
            <TableCell className="py-1.5">
              <SelectField
                data={RECIPIENTS}
                fieldName={`report.expenses.${idx}.name`}
                className="w-full h-6! border-0! shadow-none p-0 text-sm!"
                placeHolder="..."
                disabled={disabled}
              />
            </TableCell>
            <TableCell className="py-0">
              <NumericInput
                fieldName={`report.expenses.${idx}.sum`}
                className="w-14! h-7! text-center"
                disabled={disabled}
              />
            </TableCell>
            <TableCell className="text-xs text-rd py-0">
              {fieldsValues?.[idx]?.time}
            </TableCell>
            <TableCell
              onClick={() => !disabled && reset(idx)}
              className="cursor-pointer py-0"
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
