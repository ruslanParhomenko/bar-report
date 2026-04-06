import { SIDEBAR_NAVIGATION } from "@/constants/sidebar-nav";
import { EmployeesPage } from "@/features/employees/employees-page";

const SET_ACCESS =
  SIDEBAR_NAVIGATION.find((item) => item.title === EMPLOYEES_MAIN_ROUTE)
    ?.setAcces || [];

import { checkAccess } from "@/lib/check-access";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { EMPLOYEES_MAIN_ROUTE } from "@/constants/endpoint-tag";

export default function Page() {
  const hasAccess = checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;
  return <EmployeesPage />;
}
