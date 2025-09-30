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
import { expensesDefault } from "./schema";
import { RECIPIENTS } from "./constants";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function TableExpenses() {
  const { isObserver, isUser } = useAbility();
  const isDisabled = isObserver || isUser;
  const form = useFormContext();

  const reset = (idx: number) => {
    const current = form.getValues("expenses");
    current[idx] = expensesDefault[0];
    form.setValue("expenses", current);
  };
  const fieldsValues = form.watch("expenses");

  return (
    <div className="w-full">
      <Label className="text-lg font-semibold pb-4 text-bl">Expenses</Label>
      <Table className="[&_th]:text-center [&_td]:text-center w-full">
        <TableHeader>
          <TableRow className="!h-8">
            <TableHead>recipent</TableHead>
            <TableHead>sum</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {new Array(7).fill(expensesDefault)?.map((_, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <SelectField
                  data={RECIPIENTS}
                  fieldName={`expenses.${idx}.name`}
                  disabled={isDisabled}
                  className="w-full !h-8"
                />
              </TableCell>
              <TableCell className="flex items-center justify-center">
                <NumericInput
                  fieldName={`expenses.${idx}.sum`}
                  disabled={isDisabled}
                  className="!w-20 !h-8 text-center"
                />
              </TableCell>
              <TableCell className="px-2">
                {fieldsValues[idx].name && (
                  <Button
                    variant={"destructive"}
                    className="h-8 cursor-pointer"
                    onClick={() => reset(idx)}
                  >
                    X
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
