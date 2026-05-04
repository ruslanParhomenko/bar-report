"use client";

import {
  createEmployee,
  updateEmployee,
} from "@/app/actions/employees/employee-action";
import { sendNotificationEmail } from "@/app/actions/mail/email-action";
import { useEmployees } from "@/providers/employees-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import FormWrapper from "@/components/wrapper/form-wrapper";
import { useEdit } from "@/providers/edit-provider";
import { useEffect } from "react";
import EmployeeDataForm from "./employee-form";
import { defaultEmployeeForm, EmployeeForm, employeesSchema } from "./schema";
import SwitchForm from "./switch-form";
import VacationForm from "./vacation-form";

export default function EmployeeCreatePage({ id }: { id?: string }) {
  const { setIsEdit, registerReset } = useEdit();

  const employee = id ? useEmployees().find((e) => e.id === id) : undefined;

  const form = useForm<EmployeeForm>({
    resolver: zodResolver(employeesSchema),
    defaultValues: employee || defaultEmployeeForm,
  });

  const onSubmit: SubmitHandler<EmployeeForm> = async (data) => {
    if (id) {
      await updateEmployee(id, data);
      toast.success("Employee updated!");

      await sendNotificationEmail({
        text: `updated employee:${data.name}`,
      });
    } else {
      await createEmployee(data);
      toast.success("Employee added!");
      await sendNotificationEmail({
        text: `add new employee:${data.name}-${data.role}-${data.rate}`,
      });
    }

    setIsEdit(false);
  };

  const reset = () => {
    form.reset({});
    toast.success("Форма сброшена");
  };

  useEffect(() => {
    registerReset(reset);
  }, []);

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 md:gap-8">
        <EmployeeDataForm />
        <VacationForm />
        <SwitchForm />
      </div>
    </FormWrapper>
  );
}
