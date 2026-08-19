import { EmployeeCreatePage } from "@/features/settings/create-employee";
import { getEmployees } from "@/features/settings/create-employee/actions/get-employees";

export default async function Page() {
  const employees = await getEmployees();

  if (!employees) return null;
  return <EmployeeCreatePage employees={employees} />;
}
