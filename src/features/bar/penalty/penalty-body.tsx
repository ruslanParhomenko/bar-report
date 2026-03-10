"use client";
import { useEmployees } from "@/providers/employees-provider";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { defaultRemarkValue } from "./schema";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import SelectField from "@/components/inputs/select-input";
import NumericInput from "@/components/inputs/numeric-input";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BarFormValues } from "../schema";
import TextInput from "@/components/inputs/text-input";
import { useRealtimeSave } from "@/hooks/use-realtime-save";
import { realtimeReportBar } from "@/app/actions/report-bar/report-bar-action";
import { toast } from "sonner";

export function PenaltyTableBody({ isDisabled }: { isDisabled: boolean }) {
  const selectedEmployees = [...new Set(useEmployees().map((e) => e.name))];
  const { control, setValue, getValues } = useFormContext<BarFormValues>();

  const values = useWatch({
    control,
    name: "penalty.remarks",
  });
  useRealtimeSave(values, !isDisabled, async (data) => {
    if (!data) return;

    await realtimeReportBar({ ...getValues(), ...data });
    toast.success("сохранение…", { duration: 2000 });
  });

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
            <TextInput
              fieldName={`penalty.remarks.${idx}.reason`}
              placeholder="...reason"
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
