import { getEmployees } from "@/app/actions/employees/employeeAction";
import { AddEmployeeCard } from "@/features/employees/AddEmployeeCard";
import { EmployeesContextValue } from "@/providers/EmployeesProvider";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const data = await getEmployees();
  const { id } = await params;
  const employee = id ? data.find((e: any) => e.id === id) : null;
  return (
    <AddEmployeeCard employee={employee as EmployeesContextValue | null} />
  );
}
