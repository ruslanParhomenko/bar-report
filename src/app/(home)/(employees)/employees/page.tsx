import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { EMPLOYEES_MAIN_ROUTE } from "@/constants/route-tag";
import { getEmployees } from "@/features/settings/create-employee/actions/get-employees";
import { EmployeesPage } from "@/features/settings/employees";
import { requireTabAccess } from "@/lib/access";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { tab } = await searchParams;

  if (!tab) return null;

  const { user } = await requireTabAccess(EMPLOYEES_MAIN_ROUTE, tab);
  const isAdmin = user?.role === "ADMIN";

  if (!user) {
    return <InsufficientRights />;
  }

  const employees = await getEmployees();
  const employeesWithTab = employees.filter((emp) =>
    emp.role.toLowerCase().includes(tab),
  );

  return <EmployeesPage employees={employeesWithTab} isAdmin={isAdmin} />;
}
