import { getEmployees } from "@/features/settings/create-employee/actions/get-employees";
import { EmployeesProvider } from "@/providers/employees-provider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const employees = await getEmployees();

  return (
    <EmployeesProvider employees={employees}>{children}</EmployeesProvider>
  );
}
