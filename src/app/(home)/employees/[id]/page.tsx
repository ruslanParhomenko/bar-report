import { getEmployees } from "@/app/actions/employees/employee-action";
import { getUsers, UserData } from "@/app/actions/users/user-action";
import { EmployeeForm } from "@/features/employees/employee/employee-form";
import UsersForm from "@/features/employees/users/users-form";
import { EmployeesContextValue } from "@/providers/employees-provider";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { tab } = await searchParams;
  const { id } = await params;

  if (!tab || !id) return null;

  if (tab === "create-employee") {
    const employee = (await getEmployees()).find((e: any) => e.id === id);
    return <EmployeeForm employee={employee as EmployeesContextValue | null} />;
  }

  if (tab === "create-user") {
    const user = (await getUsers()).find((u: any) => u.id === id);
    return <UsersForm users={user as UserData} />;
  }

  return null;
}
