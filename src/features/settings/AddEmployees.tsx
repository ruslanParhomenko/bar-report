"use client";
import { useAbility } from "@/providers/AbilityProvider";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import {
  defaultEmployee,
  defaultVacationPay,
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
import { Card, CardContent} from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";

type FormData = EmployeesSchemaTypeData;

export default function AddEmployeesForm() {
  const { isAdmin } = useAbility();
  const form = useForm<FormData>({
    resolver: yupResolver(employeesSchema),
    defaultValues: defaultEmployee,
  });

  const { fields, append, remove,replace } = useFieldArray({
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
    try {
      AddEmployees.mutateAsync({
        name: data.name,
        role: data.role,
        rate: data.rate,
        employmentDate: new Date(data.employmentDate).toISOString(),
        vacationPay: data.vacationPay.map((pay) => ({
          startDate: pay.startDate,
          endDate: pay.endDate,
          countDays: pay.countDays,
        })),
      }),
        toast.success("Employee is added !");
      resetForm();
    } catch (e) {
      toast.error("Error adding Employee");
    }
  };
  const values = form.watch();
  const isFormDirty =
    values.name !== defaultEmployee.name ||
    values.role !== defaultEmployee.role ||
    values.rate !== defaultEmployee.rate ||
    values.employmentDate !== defaultEmployee.employmentDate ||
    values.vacationPay.length !== defaultEmployee.vacationPay.length;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Card className="shadow-md border rounded-2xl md:p-4">
          <CardContent>
            <Label className="text-base font-bold">name</Label>
            <TextInput fieldName="name" type="text" className="w-full my-4 h-10" />
            <Label className="text-base font-bold">role</Label>
            <SelectField
              data={EMPLOYEES_ROLE}
              fieldName="role"
              className="truncate w-full my-4 h-10"
            />
            <Label className="text-base font-bold">rate</Label>
            <TextInput fieldName="rate" className="my-4" />
            <Label className="text-base font-bold">employmentDate</Label>
            <DatePickerInput
              fieldName="employmentDate"
              className="my-4 w-full h-10"
            />
         

            
                <Label className="font-bold text-base">Vacation Pays:</Label>
             
        

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col gap-4 w-full my-4"
                >
                  <div className="flex justify-between gap-2 w-full">
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
                    className="w-50 h-10"
          
                  />
                  <NumericInput
                    fieldName={`vacationPay.${index}.countDays`}
                    placeholder="Days"
                    className="w-20 h-10 "
                  />
                      <Button
                    type="button"
                    variant="destructive"
                    className="h-10"
                    onClick={() =>fields.length === 1 ? replace(defaultVacationPay) : remove(index)}
                  >
                    <Trash size={16} />
                  </Button>

                  </div>

                  <div className="w-full flex justify-end">

              
                {fields.length -1  === index &&<Button
                  type="button"
                  onClick={() =>
                    append(defaultVacationPay)
                  }
                >
                  <Plus size={16} />
                </Button>}
                  </div>
                </div>
              ))}
            

            <div className="flex md:flex-row gap-4 justify-between my-4 ">
              <Button
                type="button"
                variant={"secondary"}
                onClick={() => resetForm()}
                disabled={!isFormDirty}
              >
                Reset
              </Button>
        
              <Button type="submit" disabled={!isAdmin}>
                <Plus /> Add Employee
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
