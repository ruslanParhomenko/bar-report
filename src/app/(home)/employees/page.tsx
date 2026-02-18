import { getUsers } from "@/app/actions/users/user-action";
import { EmployeesPage } from "@/features/employees/employees-page";

export default async function Page() {
  const users = await getUsers();

  return <EmployeesPage users={users} />;
}
