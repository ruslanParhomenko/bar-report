import { getEmployees } from "@/app/actions/employees/employeeAction";
import { EmployeesPage } from "@/features/employees/employees-page";
import { EmployeesContextValue } from "@/providers/EmployeesProvider";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { role } = await searchParams;
  const data = (await getEmployees()) as EmployeesContextValue[];
  const employees = role === "all" ? data : data.filter((e) => e.role === role);

  return <EmployeesPage employees={employees} />;
}
