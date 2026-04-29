"use client";

import {
  createEmployee,
  updateEmployee,
} from "@/app/actions/employees/employee-action";
import { sendNotificationEmail } from "@/app/actions/mail/email-action";
import { useRouter } from "@/i18n/navigation";
import { useEmployees } from "@/providers/employees-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { useEdit } from "@/providers/edit-provider";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import EmployeeDataForm from "./employee-data-form";
import { defaultEmployeeForm, EmployeeForm, employeesSchema } from "./schema";
import SwitchForm from "./switch-form";
import VacationForm from "./vacation-form";

export default function EmployeePage({ id }: { id?: string }) {
  const pathname = usePathname();
  const formId = pathname.split("/")[1] || "";

  const { setIsEdit, registerReset } = useEdit();

  const router = useRouter();

  const employee = id ? useEmployees().find((e) => e.id === id) : undefined;

  const form = useForm<EmployeeForm>({
    resolver: zodResolver(employeesSchema),
    defaultValues: employee || defaultEmployeeForm,
  });

  const handleSubmit: SubmitHandler<EmployeeForm> = async (data) => {
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
    router.replace("/employees");
  };

  useEffect(() => {
    setIsEdit(true);
    registerReset(form.reset);
    return () => {
      setIsEdit(false);
    };
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} id={formId}>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 md:gap-8">
          <EmployeeDataForm />
          <VacationForm />
          <SwitchForm />
        </div>
      </form>
    </Form>
  );
}
