import { getEmployees } from "@/app/actions/employees/employeeAction";
import { EmployeesPage } from "@/features/employees/EmployeesPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { tabs, role } = await searchParams;
  const data = await getEmployees();
  const employees =
    role === "all" ? data : data.filter((e: any) => e.role === role);
  return <EmployeesPage tabs={tabs as string} employees={employees as any} />;
}
