import { getEmployees } from "@/features/settings/create-employee/actions/get-employees";
import { EmployeeViewPage } from "@/features/settings/view-employee";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, employee] = await Promise.all([params, getEmployees()]);

  const employeeFound = employee.find((emp) => emp.id === id);

  if (!employeeFound) return null;

  return <EmployeeViewPage employee={employeeFound} />;
}
