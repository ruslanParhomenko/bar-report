"use client";
import { useEmployees } from "@/providers/employees-provider";
import { useFieldArray, useFormContext } from "react-hook-form";
import { defaultRemarkValue } from "./schema";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import SelectField from "@/components/inputs/select-input";
import { REASON } from "./constants";
import NumericInput from "@/components/inputs/numeric-input";
import SelectWithInput from "@/components/inputs/select-text-input";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BarFormValues } from "../schema";

export function PenaltyTableBody({ isDisabled }: { isDisabled: boolean }) {
  const selectedEmployees = useEmployees().map((e) => e.name);

  const { control, reset } = useFormContext<BarFormValues>();

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
          <TableCell>
            <SelectField
              fieldName={`penalty.remarks.${idx}.name`}
              placeHolder="..."
              data={selectedEmployees}
              className="border-0 shadow-none"
              disabled={isDisabled}
            />
          </TableCell>
          <TableCell>
            <NumericInput
              fieldName={`penalty.remarks.${idx}.dayHours`}
              className="justify-center"
              disabled={isDisabled}
            />
          </TableCell>
          <TableCell>
            <NumericInput
              fieldName={`penalty.remarks.${idx}.nightHours`}
              className="justify-center"
              disabled={isDisabled}
            />
          </TableCell>
          <TableCell>
            <NumericInput
              fieldName={`penalty.remarks.${idx}.penalty`}
              disabled={isDisabled}
            />
          </TableCell>
          <TableCell>
            <NumericInput
              fieldName={`penalty.remarks.${idx}.bonus`}
              disabled={isDisabled}
            />
          </TableCell>
          <TableCell>
            <SelectWithInput
              fieldName={`penalty.remarks.${idx}.reason`}
              data={REASON}
              placeHolder="...reason"
              className="border-0 shadow-none"
              disabled={isDisabled}
            />
          </TableCell>
          <TableCell
            className={cn("cursor-pointer text-center", isDisabled && "hidden")}
            onClick={() => append(defaultRemarkValue)}
          >
            <Plus className="text-bl w-4 h-4" />
          </TableCell>
          <TableCell
            className={cn(
              "cursor-pointer text-center text-rd",
              isDisabled && "hidden",
            )}
            onClick={() =>
              idx === 0
                ? reset({ penalty: { remarks: [defaultRemarkValue] } })
                : remove(idx)
            }
          >
            <Trash2 className="w-4 h-4" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
