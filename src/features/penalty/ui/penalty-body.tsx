"use client";
import NumericInput from "@/components/input-controlled/numeric-input";
import SelectField from "@/components/input-controlled/select-field";
import TextInput from "@/components/input-form/text-input";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { BarForm } from "@/features/bar/model/schema";
import { remarkDefault } from "@/features/penalty/model/schema";
import { Employee } from "@/features/settings/create-employee/model/type";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

export function PenaltyTableBody({
  employees,
}: {
  employees: Employee[] | null;
}) {
  const selectedEmployees = [
    ...new Set(
      employees?.filter((e) => e.status === "active").map((e) => e.name),
    ),
  ];
  const { control, setValue } = useFormContext<BarForm>();

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
        <TableRow key={item.id} className="[&>td]:py-0">
          <TableCell className="px-0 text-xs md:px-1 md:text-sm">
            {idx + 1}
          </TableCell>
          <TableCell className="bg-background sticky left-0 z-10 text-left">
            <SelectField
              fieldName={`penalty.remarks.${idx}.name`}
              placeHolder="..."
              data={selectedEmployees}
              className="h-6 border-0 px-0 text-xs shadow-none md:px-1 md:text-sm"
            />
          </TableCell>
          <TableCell>
            <NumericInput
              fieldName={`penalty.remarks.${idx}.dayHours`}
              className="justify-center text-xs md:text-sm"
            />
          </TableCell>
          <TableCell>
            <NumericInput
              fieldName={`penalty.remarks.${idx}.nightHours`}
              className="justify-center text-xs md:text-sm"
            />
          </TableCell>
          <TableCell>
            <NumericInput
              fieldName={`penalty.remarks.${idx}.penalty`}
              className="justify-center text-xs md:text-sm"
            />
          </TableCell>
          <TableCell>
            <NumericInput
              fieldName={`penalty.remarks.${idx}.bonus`}
              className="justify-center text-xs md:text-sm"
            />
          </TableCell>
          <TableCell>
            <TextInput
              fieldName={`penalty.remarks.${idx}.reason`}
              placeholder="...reason"
              className="mt-2 h-8 border-0 text-xs shadow-none md:text-sm"
            />
          </TableCell>
          <TableCell
            className={cn("cursor-pointer py-0 text-center")}
            onClick={() => append(remarkDefault)}
          >
            <Plus className="text-bl h-4 w-3 md:w-4" />
          </TableCell>
          <TableCell
            className={cn("text-rd cursor-pointer py-0 text-center")}
            onClick={() => {
              if (idx === 0 && dataRemarks.length === 1) {
                setValue(`penalty.remarks.${idx}`, remarkDefault);
              } else {
                remove(idx);
              }
            }}
          >
            <Trash2 className="h-4 w-3 md:w-4" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
