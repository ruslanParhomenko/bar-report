import { getEmployees } from "@/app/actions/employees/employeeAction";
import { getRealtimeReportBar } from "@/app/actions/report-bar/report-bar-action";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import BarForm from "@/features/bar/bar-form";
import { BarFormValues } from "@/features/bar/schema";
import { checkAccess } from "@/lib/check-access";

const SET_ACCESS = ["ADMIN", "BAR", "USER"];
const BAR_EMPLOYEES = ["waiters", "barmen"];

export default async function Page() {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;

  const realtimeData = await getRealtimeReportBar();
  const employeesName = (await getEmployees())
    .filter((emp) => BAR_EMPLOYEES.includes(emp.role))
    .map((e) => e.name);

  if (!employeesName.length) return;

  return (
    <BarForm
      realtimeData={realtimeData as BarFormValues}
      employeesName={employeesName}
    />
  );
}
