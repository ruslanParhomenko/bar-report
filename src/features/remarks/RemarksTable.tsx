import SelectField from "@/components/inputs/SelectField";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OVER_HOURS, REASON } from "./constants";
import NumericInput from "@/components/inputs/NumericInput";
import SelectWithInput from "@/components/inputs/SelectWithInput";
import { useEmployees } from "@/providers/EmployeesProvider";
import { Plus, Trash2 } from "lucide-react";
import { defaultRemarkValue, RemarksFormData } from "./schema";
import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
import DatePickerInput from "@/components/inputs/DatePickerInput";

export function RemarksTable({
  dataRemarks,
  append,
  remove,
  form,
}: {
  dataRemarks: UseFieldArrayReturn<RemarksFormData, "remarks">["fields"];
  append: UseFieldArrayReturn<RemarksFormData, "remarks">["append"];
  remove: UseFieldArrayReturn<RemarksFormData, "remarks">["remove"];
  form: UseFormReturn<RemarksFormData>;
}) {
  const employees = useEmployees();
  const selectedEmployees = employees.map((e) => e.name);

  return (
    <Table className="md:table-fixed">
      <TableHeader>
        <TableRow className="!h-8 min-h-[32px]">
          <TableCell className="w-8"></TableCell>
          <TableCell className="w-38">
            <DatePickerInput
              fieldName="date"
              className="h-6 border-0 shadow-none text-bl font-bold"
            />
          </TableCell>
          <TableCell className="text-center md:w-20 w-5">day</TableCell>
          <TableCell className="text-center md:w-20 w-5">night</TableCell>
          <TableCell className="text-center md:w-40 w-8">penality</TableCell>
          <TableCell className="text-center md:w-40 w-8">bonus</TableCell>
          <TableCell className="text-center md:w-200 w-8">reason</TableCell>
          <TableCell colSpan={2} className="text-center md:w-30 w-5">
            actions
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dataRemarks.map((item, idx) => (
          <TableRow key={item.id} className="!h-8 min-h-[32px]">
            <TableCell>{idx + 1}</TableCell>
            <TableCell>
              <SelectField
                fieldName={`remarks.${idx}.name`}
                placeHolder="..."
                data={selectedEmployees}
                className="!h-8 !min-h-0 justify-start border-0 shadow-none !text-black"
              />
            </TableCell>
            <TableCell>
              <SelectField
                fieldName={`remarks.${idx}.dayHours`}
                data={OVER_HOURS}
                className="!h-8 !min-h-0"
              />
            </TableCell>
            <TableCell>
              <SelectField
                fieldName={`remarks.${idx}.nightHours`}
                data={OVER_HOURS}
                className="!h-8 !min-h-0"
              />
            </TableCell>
            <TableCell>
              <NumericInput
                fieldName={`remarks.${idx}.penality`}
                className="!h-8 !min-h-0"
              />
            </TableCell>
            <TableCell>
              <NumericInput
                fieldName={`remarks.${idx}.bonus`}
                className="!h-8 !min-h-0"
              />
            </TableCell>
            <TableCell>
              <SelectWithInput
                fieldName={`remarks.${idx}.reason`}
                data={REASON}
                placeHolder="...reason"
                className="!h-8 !min-h-0 border-0 shadow-none"
              />
            </TableCell>
            <TableCell
              className="cursor-pointer text-center"
              onClick={() => append(defaultRemarkValue)}
            >
              <Plus className="text-bl w-4 h-4" />
            </TableCell>
            <TableCell
              className="cursor-pointer text-center text-rd"
              onClick={() =>
                idx === 0
                  ? form.reset({ remarks: [defaultRemarkValue] })
                  : remove(idx)
              }
            >
              <Trash2 className="w-4 h-4" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
