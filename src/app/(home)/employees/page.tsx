import { getEmployees } from "@/app/actions/employees/employeeAction";
import { getUsers } from "@/app/actions/users/userAction";
import { EmployeesPage } from "@/features/employees/employees-page";
import { EmployeesContextValue } from "@/providers/EmployeesProvider";

export default async function Page() {
  const [employees, users] = await Promise.all([
    (await getEmployees()) as EmployeesContextValue[],
    await getUsers(),
  ]);
  return <EmployeesPage employees={employees} users={users} />;
}
