"use client";
import { useAbility } from "@/providers/AbilityProvider";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { AddEmployeeCard } from "./AddEmployeeCard";
import { GetEmployeesCard } from "./GetEmployeesCard";
import { useEmployees } from "@/providers/EmployeesProvider";
import {
  createEmployee,
  updateEmployee,
} from "@/app/actions/employees/employeeAction";
import { useSession } from "next-auth/react";
import { sendNotificationEmail } from "@/app/actions/mail/sendNotificationEmail";
import {
  defaultEmployee,
  employeesSchema,
  EmployeesSchemaTypeData,
} from "./schema";
import { FormWrapper } from "@/components/wrapper/FormWrapper";
import { EmployeeVacationCard } from "./EmployeeVacationCard";

type FormData = EmployeesSchemaTypeData & { id?: string };

export function EmployeesPage() {
  const { data: session } = useSession();
  const { isAdmin, isManager } = useAbility();
  const form = useForm<FormData>({
    resolver: yupResolver(employeesSchema),
    defaultValues: defaultEmployee,
  });

  const employees = useEmployees();

  const handleSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const userName = session?.user?.name || "Unknown user";
      if (data.id) {
        const old = employees.find((e) => e.id === data.id);
        if (!old) throw new Error("Employee not found");

        const payloadUpdate = {
          name: data.name,
          mail: data.mail,
          tel: data.tel,
          role: data.role,
          rate: data.rate,
          employmentDate: data.employmentDate
            ? new Date(data.employmentDate).toISOString()
            : "",
          vacationPay: data.vacationPay
            .filter((pay) => pay.startDate && pay.endDate)
            .map((pay) => ({
              startDate: pay.startDate,
              endDate: pay.endDate,
              countDays: pay.countDays || "0",
            })),
        };
        await updateEmployee(data.id, payloadUpdate);
        toast.success("Employee updated!");

        const changes: string[] = [];

        for (const key of Object.keys(payloadUpdate)) {
          const newValue = (payloadUpdate as any)[key];
          const oldValue = (old as any)[key];
          if (Array.isArray(newValue) && Array.isArray(oldValue)) {
            if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
              const added = newValue.filter(
                (item) =>
                  !oldValue.some(
                    (oldItem) =>
                      JSON.stringify(oldItem) === JSON.stringify(item)
                  )
              );
              const removed = oldValue.filter(
                (item) =>
                  !newValue.some(
                    (newItem) =>
                      JSON.stringify(newItem) === JSON.stringify(item)
                  )
              );

              if (added.length > 0)
                changes.push(
                  `${key}: добавлено → ${JSON.stringify(added, null, 2)}`
                );
              if (removed.length > 0)
                changes.push(
                  `${key}: удалено → ${JSON.stringify(removed, null, 2)}`
                );
            }
            continue;
          }
          if (
            typeof newValue === "object" &&
            newValue !== null &&
            typeof oldValue === "object" &&
            oldValue !== null
          ) {
            if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
              changes.push(`${key}: изменено`);
            }
            continue;
          }
          if (newValue !== oldValue) {
            changes.push(`${key}: "${oldValue}" → "${newValue}"`);
          }
        }

        if (changes.length > 0) {
          await sendNotificationEmail({
            type: "update",
            userName,
            subject: "Employee updated",
            text: `${userName} - обновил данные сотрудника:
           ID: ${data.name}
           Changes:\n${changes.join("\n")}
          `,
          });
        }
      } else {
        const payloadCreate = {
          name: data.name,
          mail: data.mail,
          tel: data.tel,
          role: data.role,
          rate: data.rate,
          employmentDate: data.employmentDate
            ? new Date(data.employmentDate).toISOString()
            : "",
          vacationPay: data.vacationPay
            .filter((pay) => pay.startDate && pay.endDate)
            .map((pay) => ({
              startDate: pay.startDate,
              endDate: pay.endDate,
              countDays: pay.countDays || "0",
            })),
        };
        await createEmployee(payloadCreate);
        toast.success("Employee added!");

        await sendNotificationEmail({
          type: "create",
          userName,
          subject: "New employee created",
          text: `
                 ${userName} добавил нового сотрудника:

                 Name: ${payloadCreate.name}
                 Role: ${payloadCreate.role}
                 Rate: ${payloadCreate.rate}
                 Employment Date: ${payloadCreate.employmentDate}
          `,
        });
      }
      form.reset(defaultEmployee);
    } catch (e) {
      toast.error("Error saving employee");
    }
  };

  return (
    <FormWrapper
      form={form}
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row gap-4 py-6 md:px-4"
    >
      <GetEmployeesCard data={employees} />
      <AddEmployeeCard
        nameTag="vacationPay"
        disabled={!isAdmin && !isManager}
      />

      <EmployeeVacationCard />
    </FormWrapper>
  );
}
