import { getEmployees } from "@/features/settings/create-employee/actions/get-employees";
import { EmployeesPage } from "@/features/settings/employees";
import { headers } from "next/headers";

export default async function Page() {
  const [headerStore, employees] = await Promise.all([
    headers(),
    getEmployees(),
  ]);
  const isAdmin = headerStore.get("x-is-admin") === "true";

  if (!employees) return null;
  return <EmployeesPage isAdmin={isAdmin} employees={employees} />;
}
