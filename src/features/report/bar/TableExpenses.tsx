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
import { useAbility } from "@/providers/AbilityProvider";
import { expensesDefault, ExpensesSchemaType } from "./schema";
import { RECIPIENTS } from "./constants";
import { useFormContext } from "react-hook-form";
import { Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import { formatNow } from "@/utils/formatNow";

export default function TableExpenses() {
  const { isObserver, isUser } = useAbility();
  const isDisabled = isObserver || isUser;
  const form = useFormContext();

  const reset = (idx: number) => {
    const current = form.getValues("expenses");
    current[idx] = expensesDefault[0];
    form.setValue("expenses", current);
  };
  const fieldsValues = form.watch("expenses") as ExpensesSchemaType;

  useEffect(() => {
    const subscription = form.watch((value, { name: changedName }) => {
      if (changedName?.includes("name")) {
        fieldsValues?.forEach((_, idx) => {
          const nameValue = form.getValues(`expenses.${idx}.name`);
          if (nameValue) {
            form.setValue(`expenses.${idx}.time`, formatNow());
          }
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [form]);

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-0! flex justify-start">
          <TableHead colSpan={3} className="h-6 font-bold text-bl">
            Expenses
          </TableHead>
        </TableRow>
        <TableRow className="!h-8">
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
                disabled={isDisabled}
                className="w-full !h-8"
              />
            </TableCell>
            <TableCell>
              <NumericInput
                fieldName={`expenses.${idx}.sum`}
                disabled={isDisabled}
                className="!w-20 !h-8 text-center"
              />
            </TableCell>
            <TableCell className="text-xs text-rd">
              {form.watch(`expenses.${idx}.time`)}
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
