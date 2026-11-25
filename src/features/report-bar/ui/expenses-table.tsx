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
import { BarForm } from "@/features/bar/model/schema";

import { formatNow } from "@/utils/format-date";
import { useFormContext, useWatch } from "react-hook-form";

export default function TableExpenses({
  expensesList,
}: {
  expensesList: string[];
}) {
  const { control, setValue } = useFormContext<BarForm>();

  const fieldsValues = useWatch({
    name: "report.expenses",
    control,
  });

  return (
    <Table className="md:table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="text-bl w-16 pl-8 font-bold">
            Expenses
          </TableHead>
          <TableHead className="w-14" />
          <TableHead className="w-8" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {fieldsValues?.map((item, idx) => (
          <TableRow key={`${item}-${idx}`}>
            <TableCell>
              <SelectField
                data={[...expensesList, "-"]}
                fieldName={`report.expenses.${idx}.name`}
                className="h-8! w-full border-0! text-sm! font-medium! shadow-none"
                placeHolder="..."
              />
            </TableCell>
            <TableCell>
              <NumericInput
                fieldName={`report.expenses.${idx}.sum`}
                className="w-14 text-center"
                onValueChange={() => {
                  setValue(`report.expenses.${idx}.time`, formatNow(), {
                    shouldDirty: true,
                  });
                }}
              />
            </TableCell>
            <TableCell className="text-rd text-xs">
              {fieldsValues?.[idx]?.time}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
