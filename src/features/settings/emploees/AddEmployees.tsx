"use client";
import { useAbility } from "@/providers/AbilityProvider";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  defaultEmployee,
  employeesSchema,
  EmployeesSchemaTypeData,
} from "../schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useApi } from "@/hooks/useApi";
import { EMPLOYEES_FIREBOX_ENDPOINT } from "@/constants/endpoint-tag";
import toast from "react-hot-toast";
import { Form } from "@/components/ui/form";
import CardFormEmployees from "./CardFormEmployees";
import { EmployeesTable } from "./CardTableEmployees";

type FormData = EmployeesSchemaTypeData;

export default function AddEmployees() {
  const { isAdmin } = useAbility();
  const form = useForm<FormData>({
    resolver: yupResolver(employeesSchema),
    defaultValues: defaultEmployee,
  });

  const {
    createMutation: AddEmployees,
    deleteMutation: deleteEmployee,
    updateMutation: updateEmployee,
    query: queryEmployees,
  } = useApi<FormData>({
    endpoint: EMPLOYEES_FIREBOX_ENDPOINT,
    queryKey: EMPLOYEES_FIREBOX_ENDPOINT,
  });

  const { data: employees } = queryEmployees;

  const handleSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (data.id) {
        const payloadUpdate = {
          id: data.id,
          name: data.name,
          role: data.role,
          rate: data.rate,
          employmentDate: data.employmentDate
            ? new Date(data.employmentDate).toISOString()
            : "",
          newVacation: data.vacationPay
            .filter((pay) => pay.startDate && pay.endDate)
            .map((pay) => ({
              startDate: pay.startDate,
              endDate: pay.endDate,
              countDays: pay.countDays || "0",
            })),
        };
        await updateEmployee.mutateAsync(payloadUpdate);
        toast.success("Employee updated!");
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
        await AddEmployees.mutateAsync(payloadCreate);
        toast.success("Employee added!");
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
        <EmployeesTable
          data={employees as EmployeesSchemaTypeData[]}
          remove={deleteEmployee.mutateAsync}
          disabled={!isAdmin}
        />
      </form>
    </Form>
  );
}
