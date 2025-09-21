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
import { OVER_HOURS, REASON } from "../remarks/constants";
import NumericInput from "@/components/inputs/NumericInput";
import { AddRemoveFieldsButton } from "@/components/buttons/AddRemoveFieldsButton";
import { useAbility } from "@/providers/AbilityProvider";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import {
  defaultRemarks,
  defaultRemarksForm,
  RemarksForm,
} from "../remarks/schema";
import { useLocalStorageForm } from "@/hooks/use-local-storage";
import { useTranslations } from "next-intl";
import { REMARKS_ENDPOINT } from "@/constants/endpoint-tag";
import { useEmployees } from "@/providers/EmployeeProvider";

export default function RemarksTable() {
  const t = useTranslations("Home");
  const LOCAL_STORAGE_KEY = REMARKS_ENDPOINT;
  const { isObserver, isBar, isCucina, isUser } = useAbility();
  const isDisabled = isObserver || isCucina || isUser;

  //employees
  const { employees } = useEmployees();
  const selectedEmployees = employees.map((employee) => ({
    label: employee.name,
    value: employee.name,
  }));

  //localStorage
  const {
    getValue,
    setValue: setLocalStorage,
    removeValue,
  } = useLocalStorageForm<RemarksForm>(LOCAL_STORAGE_KEY);
  const localData = getValue();

  //form
  const form = useFormContext();
  const remarks = useFieldArray({
    control: form.control,
    name: "remarks",
  });
  return (
    <>
      <Label className="text-lg font-semibold pb-7 text-bl">
        Employee Remarks
      </Label>
      <Table className="[&_th]:text-center [&_td]:text-center table-fixed md:w-300 hidden md:block">
        <TableHeader>
          <TableRow className="h-10 ">
            <TableCell className="text-center md:w-80 w-12">Name</TableCell>
            <TableCell className="text-center md:w-20 w-5">day hours</TableCell>
            <TableCell className="text-center md:w-20 w-5">
              night hours
            </TableCell>
            <TableCell className="text-center md:w-40 w-8">penality</TableCell>
            <TableCell className="text-center md:w-80 w-8">reason</TableCell>
            <TableCell className="text-center md:w-20 w-5">actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {remarks?.fields?.map((item, idx) => (
            <TableRow key={idx}>
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
                  formField={remarks}
                  defaultValues={defaultRemarks}
                  index={idx}
                  disabled={isDisabled}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-col gap-2 md:hidden">
        {remarks?.fields?.map((item, idx) => (
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
                formField={remarks}
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
