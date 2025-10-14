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
import SelectWithInput from "@/components/inputs/SelectWithInput";

export default function RemarksTable({
  fields,
  employees,
}: {
  fields: UseFieldArrayReturn<any>;
  employees: { name: string }[];
}) {
  const t = useTranslations("Home");
  const { isObserver, isBar, isCucina, isUser, isMngr } = useAbility();
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
      <Table className="md:w-full">
        <TableHeader>
          <TableRow className="h-10">
            <TableCell className="text-center md:w-80 w-12"></TableCell>
            <TableCell className="text-center md:w-20 w-5">day</TableCell>
            <TableCell className="text-center md:w-20 w-5">night</TableCell>
            <TableCell className="text-center md:w-40 w-8">penality</TableCell>
            <TableCell className="text-center md:w-40 w-8">bonus</TableCell>

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
                <NumericInput
                  fieldName={`remarks.${idx}.bonus`}
                  disabled={isDisabled}
                />
              </TableCell>
              <TableCell>
                <SelectWithInput
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
    </>
  );
}
