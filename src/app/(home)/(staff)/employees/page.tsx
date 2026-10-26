import { getEmployees } from "@/features/settings/create-employee/actions/get-employees";
import { EmployeesPage } from "@/features/settings/employees";

export default async function Page() {
  const employees = await getEmployees();

  return <EmployeesPage employees={employees} />;
}
