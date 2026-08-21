import { getEmployees } from "@/features/settings/create-employee/actions/get-employees";
import { EmployeesPage } from "@/features/settings/employees";
import { headers } from "next/headers";

export default async function Page() {
  const employees = await getEmployees();
  const headerStore = await headers();

  const isAdmin = headerStore.get("x-is-admin") === "true";

  return <EmployeesPage isAdmin={isAdmin} employees={employees} />;
}
