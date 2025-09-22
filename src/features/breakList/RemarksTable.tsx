"use client";
import SelectField from "@/components/inputs/SelectField";
import SelectInput from "@/components/inputs/SelectInput";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import NumericInput from "@/components/inputs/NumericInput";
import { AddRemoveFieldsButton } from "@/components/buttons/AddRemoveFieldsButton";
import { useAbility } from "@/providers/AbilityProvider";
import { UseFieldArrayReturn } from "react-hook-form";

import { useTranslations } from "next-intl";

import { OVER_HOURS, REASON } from "./constant";
import { defaultRemarks } from "./schema";

export default function RemarksTable({
  fields,
  employees,
}: {
  fields: UseFieldArrayReturn<any>;
  employees: { name: string }[];
}) {
  const t = useTranslations("Home");
  const { isObserver, isBar, isCucina, isUser } = useAbility();
  const isDisabled = isObserver || isCucina || isUser;

  //employees

  const selectedEmployees = employees?.map((employee) => ({
    label: employee.name,
    value: employee.name,
  }));

  return (
    <>
      <Label className="text-lg font-semibold text-bl table-fixed">
        Remarks
      </Label>
      <Table className="md:w-full hidden md:block">
        <TableHeader>
          <TableRow className="h-10">
            <TableCell className="text-center md:w-80 w-12"></TableCell>
            <TableCell className="text-center md:w-20 w-5">day</TableCell>
            <TableCell className="text-center md:w-20 w-5">night</TableCell>
            <TableCell className="text-center md:w-40 w-8">penality</TableCell>
            <TableCell className="text-center md:w-90 w-8">reason</TableCell>
            <TableCell className="text-center md:w-40 w-5">actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.fields?.map((item, idx) => (
            <TableRow key={item.id}>
              <TableCell>
                <SelectInput
                  fieldName={`remarks.${idx}.name`}
                  fieldLabel=""
                  data={selectedEmployees}
                  disabled={isDisabled}
                />
              </TableCell>
              <TableCell>
                <SelectField
                  fieldName={`remarks.${idx}.dayHours`}
                  data={OVER_HOURS}
                  disabled={isDisabled}
                />
              </TableCell>
              <TableCell>
                <SelectField
                  fieldName={`remarks.${idx}.nightHours`}
                  data={OVER_HOURS}
                  disabled={isDisabled}
                />
              </TableCell>
              <TableCell>
                <NumericInput
                  fieldName={`remarks.${idx}.penality`}
                  disabled={isDisabled}
                />
              </TableCell>
              <TableCell>
                <SelectField
                  fieldName={`remarks.${idx}.reason`}
                  data={REASON}
                  disabled={isDisabled}
                />
              </TableCell>
              <TableCell>
                <AddRemoveFieldsButton
                  formField={fields}
                  defaultValues={defaultRemarks}
                  index={idx}
                  disabled={isDisabled}
                  className="!gap-5"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-col gap-2 md:hidden">
        {fields.fields?.map((item, idx) => (
          <div
            key={item.id ?? idx}
            className="border rounded-lg p-2 shadow-sm bg-white"
          >
            <div className="grid grid-cols-[40%_60%] gap-1 mb-2">
              <span className="text-base">Name:</span>
              <SelectInput
                fieldName={`remarks.${idx}.name`}
                fieldLabel=""
                data={selectedEmployees}
                disabled={isDisabled}
              />
            </div>

            <div className="grid grid-cols-[40%_60%] gap-1 mb-2">
              <span className="text-base">Day Hours:</span>
              <SelectField
                fieldName={`remarks.${idx}.dayHours`}
                data={OVER_HOURS}
                disabled={isDisabled}
              />
            </div>

            <div className="grid grid-cols-[40%_60%] gap-1 mb-2">
              <span className="text-base">Night Hours:</span>
              <SelectField
                fieldName={`remarks.${idx}.nightHours`}
                data={OVER_HOURS}
                disabled={isDisabled}
              />
            </div>

            <div className="grid grid-cols-[40%_60%] gap-1 mb-2">
              <span className="text-base">Penality:</span>
              <NumericInput
                fieldName={`remarks.${idx}.penality`}
                disabled={isDisabled}
              />
            </div>

            <div className="grid grid-cols-[40%_60%] gap-1 mb-2">
              <span className="text-base">Reason:</span>
              <SelectField
                fieldName={`remarks.${idx}.reason`}
                data={REASON}
                disabled={isDisabled}
              />
            </div>

            <div className="flex justify-end mt-2">
              <AddRemoveFieldsButton
                formField={fields}
                defaultValues={defaultRemarks}
                index={idx}
                disabled={isDisabled}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
