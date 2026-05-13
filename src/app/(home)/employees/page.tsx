import { EmployeesPage } from "@/features/employees/employees-page";
import { headers } from "next/headers";

export default async function Page() {
  const headerStore = await headers();
  const isAdmin = headerStore.get("x-is-admin") === "true";
  return <EmployeesPage isAdmin={isAdmin} />;
}
