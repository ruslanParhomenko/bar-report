"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import FormWrapper from "@/components/wrapper/form-wrapper";
import { useEdit } from "@/providers/edit-provider";
import { useEffect } from "react";
import { createEmployee } from "../actions/create-employee";
import { updateEmployee } from "../actions/update-employee";
import {
  defaultEmployeeForm,
  EmployeeForm,
  employeesSchema,
} from "../model/schema";
import { Employee } from "../model/type";
import EmployeeDataForm from "./employee-form";
import SwitchForm from "./switch-form";
import VacationForm from "./vacation-form";

export function EmployeeCreatePage({
  id,
  employees,
}: {
  id?: string;
  employees: Employee[];
}) {
  const { setIsEdit, registerReset } = useEdit();
  const employee = id ? employees.find((e) => e.id === id) : undefined;

  const form = useForm<EmployeeForm>({
    resolver: zodResolver(employeesSchema),
    defaultValues: employee || defaultEmployeeForm,
  });
  const onSubmit: SubmitHandler<EmployeeForm> = async (data) => {
    try {
      const name = data.name.trim();
      const role = data.role.trim();
      const existsName = employees.find((e) => e.name.trim() === name);

      if (id) {
        await updateEmployee(id, data);
        toast.success("Employee updated!");

        // await sendNotificationEmail({
        //   text: `updated employee: ${data.name}`,
        // });
      } else {
        if (existsName && existsName.role === role) {
          toast.error("Name already exists");
          return;
        }

        await createEmployee(data);
        toast.success("Employee added!");

        // await sendNotificationEmail({
        //   text: `add new employee: ${data.name} - ${data.role} - ${data.rate}`,
        // });
      }

      setIsEdit(false);

      window.location.href = "/employees";
    } catch (error) {
      toast.error("An error occurred");
    }
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
