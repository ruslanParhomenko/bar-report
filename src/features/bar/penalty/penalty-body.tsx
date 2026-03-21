"use client";
import { useEmployees } from "@/providers/employees-provider";
import { useFieldArray, useFormContext } from "react-hook-form";
import { defaultRemarkValue } from "./schema";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import SelectField from "@/components/inputs-form/select-input";
import NumericInput from "@/components/inputs-form/numeric-input";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BarFormValues } from "../schema";
import TextInput from "@/components/inputs-form/text-input";

export function PenaltyTableBody({ isDisabled }: { isDisabled: boolean }) {
  const selectedEmployees = [...new Set(useEmployees().map((e) => e.name))];
  const { control, setValue } = useFormContext<BarFormValues>();

  const {
    fields: dataRemarks,
    append,
    remove,
  } = useFieldArray({
    control: control,
    name: "penalty.remarks",
  });

  return (
    <TableBody>
      {dataRemarks.map((item, idx) => (
        <TableRow key={item.id}>
          <TableCell className="py-0">{idx + 1}</TableCell>
          <TableCell className="py-0">
            <SelectField
              fieldName={`penalty.remarks.${idx}.name`}
              placeHolder="..."
              data={selectedEmployees}
              className="border-0 shadow-none h-6"
              disabled={isDisabled}
            />
          </TableCell>
          <TableCell className="py-0">
            <NumericInput
              fieldName={`penalty.remarks.${idx}.dayHours`}
              className="justify-center h-6"
              disabled={isDisabled}
            />
          </TableCell>
          <TableCell className="py-0">
            <NumericInput
              fieldName={`penalty.remarks.${idx}.nightHours`}
              className="justify-center h-6"
              disabled={isDisabled}
            />
          </TableCell>
          <TableCell className="py-0">
            <NumericInput
              fieldName={`penalty.remarks.${idx}.penalty`}
              className="justify-center h-6"
              disabled={isDisabled}
            />
          </TableCell>
          <TableCell className="py-0">
            <NumericInput
              fieldName={`penalty.remarks.${idx}.bonus`}
              className="justify-center h-6"
              disabled={isDisabled}
            />
          </TableCell>
          <TableCell className="py-0">
            <TextInput
              fieldName={`penalty.remarks.${idx}.reason`}
              placeholder="...reason"
              className="border-0 shadow-none h-6"
              disabled={isDisabled}
            />
          </TableCell>
          <TableCell
            className={cn(
              "cursor-pointer text-center py-0",
              isDisabled && "hidden",
            )}
            onClick={() => append(defaultRemarkValue)}
          >
            <Plus className="text-bl w-4 h-4" />
          </TableCell>
          <TableCell
            className={cn(
              "cursor-pointer text-center text-rd py-0",
              isDisabled && "hidden",
            )}
            onClick={() => {
              if (idx === 0 && dataRemarks.length === 1) {
                setValue(`penalty.remarks.${idx}`, defaultRemarkValue);
              } else {
                remove(idx);
              }
            }}
          >
            <Trash2 className="w-4 h-4" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
