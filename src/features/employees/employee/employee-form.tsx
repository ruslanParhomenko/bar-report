"use client";

import {
  createEmployee,
  updateEmployee,
} from "@/app/actions/employees/employee-action";
import { sendNotificationEmail } from "@/app/actions/mail/email-action";
import FormInput from "@/components/wrapper/form";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useAbility } from "@/providers/ability-provider";
import { useEmployees } from "@/providers/employees-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  defaultEmployeeSchemaValues,
  employeesSchema,
  EmployeesSchemaTypeData,
} from "./schema";

import EmployeeDataForm from "./employee-data-form";
import SwitchForm from "./switch-form";
import VacationForm from "./vacation-form";

type FormData = EmployeesSchemaTypeData & { id?: string };

export function EmployeeForm({ id }: { id?: string }) {
  const { isAdmin, isManager } = useAbility();
  const isDisabled = !isAdmin && !isManager;

  const router = useRouter();

  const employee = id
    ? useEmployees().find((e: any) => e.id === id)
    : undefined;

  const form = useForm<EmployeesSchemaTypeData>({
    resolver: zodResolver(employeesSchema),
    defaultValues: employee || defaultEmployeeSchemaValues,
  });

  const handleSubmit: SubmitHandler<FormData> = async (data) => {
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
    form.reset(defaultEmployeeSchemaValues);
    router.back();
  };

  const returUrl = "/employees#tab=employees";

  return (
    <FormInput
      form={form}
      onSubmit={handleSubmit}
      className={cn("flex h-[90vh] flex-col md:px-4")}
      resetButton={id ? false : true}
      returnButton={true}
      url={returUrl}
      disabled={isDisabled}
    >
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 md:gap-8">
        <EmployeeDataForm />
        <VacationForm />
        <SwitchForm />
      </div>
    </FormInput>
  );
}
