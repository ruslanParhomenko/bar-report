"use client";
import { useAbility } from "@/providers/AbilityProvider";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  defaultEmployee,
  employeesSchema,
  EmployeesSchemaTypeData,
} from "../schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import CardFormEmployees from "./CardFormEmployees";
import { EmployeesTable } from "./CardTableEmployees";
import { useEmployees } from "@/providers/EmployeesProvider";
import {
  createEmployee,
  updateEmployee,
} from "@/app/actions/employees/employeeAction";
import { useSession } from "next-auth/react";
import { sendNotificationEmail } from "@/app/actions/mail/sendNotificationEmail";

type FormData = EmployeesSchemaTypeData;

export default function AddEmployees() {
  const { data: session } = useSession();
  const { isAdmin } = useAbility();
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
          if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
            changes.push(`${key}: "${oldValue}" → "${newValue}"`);
          }
        }
        // отправка email
        if (changes.length > 0) {
          await sendNotificationEmail({
            type: "update",
            userName,
            subject: "Employee updated",
            text: `${userName} - обновил данные сотрудника:
                   ID: ${data.name}
                   Changes: ${changes.join("\n")}
                  `,
          });
        }
      } else {
        const payloadCreate = {
          name: data.name,
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="grid grid-cols-1 md:grid-cols-[27%_72%] w-full gap-4 mt-4"
      >
        <CardFormEmployees nameTag="vacationPay" disabled={!isAdmin} />
        <EmployeesTable data={employees as EmployeesSchemaTypeData[]} />
      </form>
    </Form>
  );
}
