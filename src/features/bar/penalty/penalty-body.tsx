"use client";
import NumericInput from "@/components/input-controlled/numeric-input";
import SelectField from "@/components/input-controlled/select-field";
import TextInput from "@/components/input-controlled/text-input";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useEmployees } from "@/providers/employees-provider";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { BarFormValues } from "../schema";
import { defaultRemarkValue } from "./schema";

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
          <TableCell>{idx + 1}</TableCell>
          <TableCell className="bg-background sticky left-0 z-10 py-0 text-left">
            <SelectField
              fieldName={`penalty.remarks.${idx}.name`}
              placeHolder="..."
              data={selectedEmployees}
              className="h-6 border-0 shadow-none"
              disabled={isDisabled}
            />
          </TableCell>
          <TableCell>
            <NumericInput
              fieldName={`penalty.remarks.${idx}.dayHours`}
              className="h-6 justify-center"
              disabled={isDisabled}
            />
          </TableCell>
          <TableCell>
            <NumericInput
              fieldName={`penalty.remarks.${idx}.nightHours`}
              className="h-6 justify-center"
              disabled={isDisabled}
            />
          </TableCell>
          <TableCell>
            <NumericInput
              fieldName={`penalty.remarks.${idx}.penalty`}
              className="h-6 justify-center"
              disabled={isDisabled}
            />
          </TableCell>
          <TableCell>
            <NumericInput
              fieldName={`penalty.remarks.${idx}.bonus`}
              className="h-6 justify-center"
              disabled={isDisabled}
            />
          </TableCell>
          <TableCell>
            <TextInput
              fieldName={`penalty.remarks.${idx}.reason`}
              placeholder="...reason"
              className="h-6 border-0 shadow-none"
              disabled={isDisabled}
            />
          </TableCell>
          <TableCell
            className={cn(
              "cursor-pointer py-0 text-center",
              isDisabled && "hidden",
            )}
            onClick={() => append(defaultRemarkValue)}
          >
            <Plus className="text-bl h-4 w-4" />
          </TableCell>
          <TableCell
            className={cn(
              "text-rd cursor-pointer py-0 text-center",
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
            <Trash2 className="h-4 w-4" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
