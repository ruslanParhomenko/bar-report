"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import NumericInput from "@/components/inputs/NumericInput";
import SelectField from "@/components/inputs/SelectField";
import { ExpensesSchemaType } from "./schema";
import { RECIPIENTS } from "./constants";
import { useFormContext } from "react-hook-form";
import { Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import { formatNow } from "@/utils/formatNow";

export default function TableExpenses() {
  const form = useFormContext();

  const reset = (idx: number) => {
    form.setValue(
      `expenses.${idx}`,
      {
        name: "",
        sum: "",
        time: "",
      },
      { shouldDirty: true, shouldTouch: true }
    );
  };
  const fieldsValues = form.watch("expenses") as ExpensesSchemaType[];

  useEffect(() => {
    fieldsValues?.forEach((item, idx) => {
      if (item?.sum && item?.name && !item?.time) {
        form.setValue(`expenses.${idx}.time`, formatNow(), {
          shouldDirty: true,
        });
      }
    });
  }, [fieldsValues, form]);

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-0! flex justify-start">
          <TableHead colSpan={3} className="h-6 font-bold text-bl">
            Expenses
          </TableHead>
        </TableRow>
        <TableRow>
          <TableHead className="md:w-38">recipient</TableHead>
          <TableHead className="md:w-15">sum</TableHead>
          <TableHead className="md:w-15">time</TableHead>
          <TableHead className="md:w-10">action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fieldsValues?.map((_, idx: number) => (
          <TableRow key={idx}>
            <TableCell>
              <SelectField
                data={RECIPIENTS}
                fieldName={`expenses.${idx}.name`}
                className="w-full h-8!"
              />
            </TableCell>
            <TableCell>
              <NumericInput
                fieldName={`expenses.${idx}.sum`}
                className="w-20! h-8! text-center"
              />
            </TableCell>
            <TableCell className="text-xs text-rd">
              {fieldsValues?.[idx]?.time}
            </TableCell>
            <TableCell onClick={() => reset(idx)} className="cursor-pointer">
              {fieldsValues?.[idx]?.name && (
                <Trash2Icon className="w-4 h-4 mx-2 text-rd" />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
