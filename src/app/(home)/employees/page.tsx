import { EmployeesPage } from "@/features/employees/employees-page";
import { checkAccess } from "@/lib/check-access";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { EMPLOYEES_MAIN_ROUTE } from "@/constants/endpoint-tag";

export default function Page() {
  const hasAccess = checkAccess(EMPLOYEES_MAIN_ROUTE);
  if (!hasAccess) return <InsufficientRights />;
  return <EmployeesPage />;
}
