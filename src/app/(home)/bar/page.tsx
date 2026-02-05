import { getRealtimeBreakList } from "@/app/actions/break/break-action";
import { getEmployees } from "@/app/actions/employees/employeeAction";
import { getRealtimeRemarksList } from "@/app/actions/remarks/remarks-action";
import { getRealtimeReportBar } from "@/app/actions/report-bar/report-bar-action";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import BarForm from "@/features/bar/bar-form";
import { checkAccess } from "@/lib/check-access";

const SET_ACCESS = ["ADMIN", "BAR", "USER"];
const BAR_EMPLOYEES = ["waiters", "barmen"];

export default async function Page() {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;

  const [realtimeDataReport, realtimeDataPenalty, realtimeDataBreak] =
    await Promise.all([
      getRealtimeReportBar(),
      getRealtimeRemarksList(),
      getRealtimeBreakList(),
    ]);
  const employeesName = (await getEmployees())
    .filter((emp) => BAR_EMPLOYEES.includes(emp.role))
    .map((e) => e.name);

  if (!employeesName.length) return;

  return (
    <BarForm
      realtimeData={{
        report: realtimeDataReport ?? undefined,
        penalty: realtimeDataPenalty ?? undefined,
        breakForm: realtimeDataBreak ?? undefined,
      }}
      employeesName={employeesName}
    />
  );
}
