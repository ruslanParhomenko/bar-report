import { getRealtimeBreakList } from "@/app/actions/break/break-action";
import { getEmployees } from "@/app/actions/employees/employeeAction";

import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import BreakForm from "@/features/break/break-form";
import { checkAccess } from "@/lib/check-access";

const SET_ACCESS = ["ADMIN", "BAR", "USER"];
const BAR_EMPLOYEES = ["waiters", "barmen"];

export default async function Page() {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;
  const employeesName = (await getEmployees())
    .filter((emp) => BAR_EMPLOYEES.includes(emp.role))
    .map((e) => e.name);

  const realtimeData = (await getRealtimeBreakList()) ?? undefined;
  return (
    <BreakForm employeesName={employeesName} defaultValues={realtimeData} />
  );
}
