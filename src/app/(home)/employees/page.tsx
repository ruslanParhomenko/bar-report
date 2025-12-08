import { getEmployees } from "@/app/actions/employees/employeeAction";
import { EmployeesPage } from "@/features/employees/EmployeesPage";

import { authOptions } from "@/lib/auth";
import { EmployeesContextValue } from "@/providers/EmployeesProvider";
import { getServerSession } from "next-auth";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getServerSession(authOptions);
  const isAdmin =
    session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER";

  const { role } = await searchParams;

  const filterRole = role === undefined ? "waiters" : (role as string);
  const data = (await getEmployees()) as EmployeesContextValue[];
  const employees =
    filterRole === "all" ? data : data.filter((e) => e.role === role);

  return <EmployeesPage employees={employees} isAdmin={isAdmin} />;
}
