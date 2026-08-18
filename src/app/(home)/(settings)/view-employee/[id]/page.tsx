import { getEmployees } from "@/features/settings/create-employee/actions/get-employees";
import EmployeePage from "@/features/settings/view-employee/employee-page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, employee] = await Promise.all([params, getEmployees()]);

  const employeeFound = employee.find((emp) => emp.id === id);

  if (!employeeFound) return null;

  return <EmployeePage employee={employeeFound} />;
}
