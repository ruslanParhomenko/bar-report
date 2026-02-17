import { getEmployees } from "@/app/actions/employees/employee-action";
import { getUsers } from "@/app/actions/users/user-action";
import { EmployeesPage } from "@/features/employees/employees-page";
import { EmployeesContextValue } from "@/providers/employees-provider";

export default async function Page() {
  const [employees, users] = await Promise.all([
    (await getEmployees()) as EmployeesContextValue[],
    await getUsers(),
  ]);
  return <EmployeesPage employees={employees} users={users} />;
}
