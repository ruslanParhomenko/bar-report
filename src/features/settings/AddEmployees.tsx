"use client";
import { useAbility } from "@/providers/AbilityProvider";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import {
  defaultEmployee,
  employeesSchema,
  EmployeesSchemaTypeData,
} from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useApi } from "@/hooks/useApi";
import { EMPLOYEES_FIREBOX_ENDPOINT } from "@/constants/endpoint-tag";
import toast from "react-hot-toast";
import { Form } from "@/components/ui/form";
import TextInput from "@/components/inputs/TextInput";
import SelectField from "@/components/inputs/SelectField";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { EMPLOYEES_ROLE } from "./constants";
import NumericInput from "@/components/inputs/NumericInput";
import { DatePickerRange } from "@/components/inputs/DatePickerRange";
import DatePickerInput from "@/components/inputs/DatePickerInput";

type FormData = EmployeesSchemaTypeData;

export default function AddEmployeesForm() {
  const { isAdmin } = useAbility();
  const form = useForm<FormData>({
    resolver: yupResolver(employeesSchema),
    defaultValues: defaultEmployee,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "vacationPay",
  });
  const { reset: resetForm } = form;

  const { createMutation: AddEmployees } = useApi<FormData>({
    endpoint: EMPLOYEES_FIREBOX_ENDPOINT,
    queryKey: EMPLOYEES_FIREBOX_ENDPOINT,
    fetchInit: false,
  });

  const handleSubmit: SubmitHandler<FormData> = async (data) => {
    console.log(data);
    // try {
    //   AddEmployees.mutateAsync({
    //     name: data.name,
    //     role: data.role,
    //     rate: data.rate,
    //     employmentDate: data.employmentDate,
    //     vacationPay: data.vacationPay.map((pay) => ({
    //       startDate: pay.startDate,
    //       endDate: pay.endDate,
    //       countDays: pay.countDays,
    //     })),
    //   }),
    //     toast.success("Employee is added !");
    //   resetForm();
    // } catch (e) {
    //   toast.error("Error adding Employee");
    // }
  };
  const values = form.watch();
  const isFormDirty =
    values.name !== defaultEmployee.name ||
    values.role !== defaultEmployee.role;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col md:flex-row justify-between gap-10 py-5"
      >
        <div className="flex md:gap-20 gap-3 flex-col md:flex-row">
          <TextInput
            fieldName="name"
            type="text"
            className="truncate"
            placeholder="Enter name"
          />
          <SelectField
            data={EMPLOYEES_ROLE}
            fieldName="role"
            className="truncate w-[100]"
            placeHolder="Select role"
          />
          <NumericInput fieldName="rate" placeholder="Enter rate" />
          <DatePickerInput fieldName="employmentDate" />
          {isFormDirty && (
            <Button
              type="button"
              variant={"secondary"}
              onClick={() => resetForm()}
            >
              Reset
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-4 md:mt-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold">Vacation Pays:</span>
            <Button
              type="button"
              size="sm"
              onClick={() =>
                append({ startDate: "", endDate: "", countDays: "" })
              }
            >
              <Plus size={16} />
            </Button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex gap-2 items-center flex-wrap md:flex-nowrap"
            >
              <DatePickerRange
                onDataChange={(range) => {
                  if (range?.from && range?.to) {
                    const diffTime = Math.abs(
                      range.to.getTime() - range.from.getTime()
                    );
                    const diffDays =
                      Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                    form.setValue(
                      `vacationPay.${index}.startDate`,
                      range.from.toISOString()
                    );
                    form.setValue(
                      `vacationPay.${index}.endDate`,
                      range.to.toISOString()
                    );
                    form.setValue(
                      `vacationPay.${index}.countDays`,
                      diffDays.toString()
                    );
                  }
                }}
                resetTrigger={false}
              />

              <NumericInput
                fieldName={`vacationPay.${index}.countDays`}
                placeholder="Days"
                className="w-20"
              />

              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => remove(index)}
              >
                <Trash size={16} />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex md:flex-row gap-4 justify-end mt-4 md:mt-0">
          <Button type="submit" disabled={!isAdmin}>
            <Plus /> Add Employee
          </Button>
        </div>
      </form>
    </Form>
  );
}
