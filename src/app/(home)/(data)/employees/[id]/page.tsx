import { getEmployees } from "@/app/actions/employees/employeeAction";
import { EmployeeForm } from "@/features/employees/employee-form";
import { EmployeesContextValue } from "@/providers/EmployeesProvider";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const data = await getEmployees();
  const { id } = await params;
  const employee = id ? data.find((e: any) => e.id === id) : null;
  return <EmployeeForm employee={employee as EmployeesContextValue | null} />;
}
