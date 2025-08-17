"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFormContext, useWatch } from "react-hook-form";
import { Label } from "@radix-ui/react-dropdown-menu";
import NumericInput from "@/components/inputs/NumericInput";
import { useEffect } from "react";
import SelectField from "@/components/inputs/SelectField";
import { expensesDefault } from "./schema";
import { useAbility } from "@/providers/AbilityProvider";

const RECIPIENTS = ["NBM", "BAR", "NORI", "DISHES", "BN", "OTHER"];

export default function TableEspenses() {
  const { isObserver } = useAbility();

  const { setValue, control, watch } = useFormContext();

  const expenses = useWatch({ name: "expenses", control });
  useEffect(() => {
    const total = expenses?.reduce((acc: number, expense: any) => {
      return acc + Number(expense?.sum ?? 0);
    }, 0);
    setValue("total", total, {
      shouldDirty: true,
    });
  }, [expenses, setValue]);

  return (
    <div className="w-full">
      <Label className="text-lg font-semibold pb-7">Expenses</Label>
      <Table className="[&_th]:text-center [&_td]:text-center">
        <TableHeader>
          <TableRow className="h-10">
            <TableHead>RECIPIENT</TableHead>
            <TableHead>SUM</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {new Array(8).fill(expensesDefault)?.map((_, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <SelectField
                  data={RECIPIENTS}
                  fieldName={`expenses.${idx}.name`}
                  disabled={isObserver}
                />
              </TableCell>
              <TableCell>
                <NumericInput
                  fieldName={`expenses.${idx}.sum`}
                  disabled={isObserver}
                />
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="h-10">
            <TableCell>
              <NumericInput fieldName="total" disabled={isObserver} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
