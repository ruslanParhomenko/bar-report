import { useEmployees } from "@/providers/EmployeesProvider";
import { useFieldArray, useFormContext } from "react-hook-form";
import { defaultRemarkValue, RemarksFormData } from "./schema";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import SelectField from "@/components/inputs/SelectField";
import { REASON } from "./constants";
import NumericInput from "@/components/inputs/NumericInput";
import SelectWithInput from "@/components/inputs/SelectWithInput";
import { Plus, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import TextInput from "@/components/inputs/TextInput";
import { cn } from "@/lib/utils";

export function PenaltyTableBody({ isDisabled }: { isDisabled?: boolean }) {
  const { id } = useParams();

  const employees = useEmployees();
  const selectedEmployees = employees.map((e) => e.name);

  const { control, reset } = useFormContext<RemarksFormData>();

  const {
    fields: dataRemarks,
    append,
    remove,
  } = useFieldArray({
    control: control,
    name: "remarks",
  });
  return (
    <TableBody>
      {dataRemarks.map((item, idx) => (
        <TableRow key={item.id}>
          <TableCell>{idx + 1}</TableCell>
          <TableCell>
            <SelectField
              fieldName={`remarks.${idx}.name`}
              placeHolder="..."
              data={selectedEmployees}
              className="border-0 shadow-none"
              disabled={isDisabled}
            />
          </TableCell>
          <TableCell>
            <NumericInput
              fieldName={`remarks.${idx}.dayHours`}
              className="justify-center"
              disabled={isDisabled}
            />
          </TableCell>
          <TableCell>
            <NumericInput
              fieldName={`remarks.${idx}.nightHours`}
              className="justify-center"
              disabled={isDisabled}
            />
          </TableCell>
          <TableCell>
            <NumericInput
              fieldName={`remarks.${idx}.penalty`}
              disabled={isDisabled}
            />
          </TableCell>
          <TableCell>
            <NumericInput
              fieldName={`remarks.${idx}.bonus`}
              disabled={isDisabled}
            />
          </TableCell>
          <TableCell>
            {id ? (
              <TextInput
                fieldName={`remarks.${idx}.reason`}
                className="w-auto"
                disabled={isDisabled}
              />
            ) : (
              <SelectWithInput
                fieldName={`remarks.${idx}.reason`}
                data={REASON}
                placeHolder="...reason"
                className="border-0 shadow-none"
                disabled={isDisabled}
              />
            )}
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
              idx === 0 ? reset({ remarks: [defaultRemarkValue] }) : remove(idx)
            }
          >
            <Trash2 className="w-4 h-4" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
