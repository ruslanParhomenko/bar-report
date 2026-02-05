import { getRemarksByUniqueKey } from "@/app/actions/remarks/remarks-action";
import {
  getScheduleByMonthYear,
  SchedulesContextValue,
} from "@/app/actions/schedule/scheduleAction";
import { getTipsFormById } from "@/app/actions/tips/tipsAction";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { remarksByUniqueEmployee } from "@/features/penalty/utils";
import { PageResult } from "@/features/result/result-page";
import { checkAccess } from "@/lib/check-access";

const ROLE = {
  barmen: "bar",
  waiters: "bar",
  dish: "dish",
  cucina: "cucina",
};

const SET_ACCESS = ["ADMIN", "MNGR"];

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ role: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  // access control
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;

  const { month, year } = await searchParams;
  const { role } = await params;
  if (!role || !month || !year) return null;
  // key
  const uniqueKey = `${year}-${month}`;

  const [schedule, remarks, tips] = await Promise.all([
    getScheduleByMonthYear(month, year),
    getRemarksByUniqueKey(uniqueKey),
    getTipsFormById(uniqueKey),
  ]);
  const dataSchedule = schedule.filter(
    (item: any) => item.role === ROLE[role as keyof typeof ROLE],
  );

  const remarksByEmployee =
    remarks && remarksByUniqueEmployee(remarks.data).formattedData;
  const dataTips = tips?.form_data ?? null;

  return (
    <PageResult
      dataSchedule={dataSchedule as SchedulesContextValue[]}
      dataRemarks={
        remarksByEmployee as ReturnType<
          typeof remarksByUniqueEmployee
        >["formattedData"]
      }
      dataTips={dataTips}
      month={month as string}
      year={year as string}
      role={role as string}
    />
  );
}
