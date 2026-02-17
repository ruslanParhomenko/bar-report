import { getRemarksByUniqueKey } from "@/app/actions/remarks/remarks-action";
import {
  getScheduleByMonthYear,
  SchedulesContextValue,
} from "@/app/actions/schedule/schedule-action";
import { getTipsFormById } from "@/app/actions/tips/tips-action";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { remarksByUniqueEmployee } from "@/features/archive/penalty/utils";
import { PageResult } from "@/features/result/result-page";
import { checkAccess } from "@/lib/check-access";
import { MONTHS } from "@/utils/get-month-days";

const SET_ACCESS = ["ADMIN", "MNGR"];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  // access control
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;

  const { month, year } = await searchParams;

  const setMonth = month ?? MONTHS[new Date().getMonth()];
  const setYear = year ?? new Date().getFullYear().toString();

  // key
  const uniqueKey = `${setYear}-${setMonth}`;

  const [schedule, remarks, tips] = await Promise.all([
    getScheduleByMonthYear(setMonth, setYear),
    getRemarksByUniqueKey(uniqueKey),
    getTipsFormById(uniqueKey),
  ]);

  const remarksByEmployee =
    remarks && remarksByUniqueEmployee(remarks.data).formattedData;
  const dataTips = tips?.form_data ?? null;

  return (
    <PageResult
      dataSchedule={schedule as SchedulesContextValue[]}
      dataRemarks={
        remarksByEmployee as ReturnType<
          typeof remarksByUniqueEmployee
        >["formattedData"]
      }
      dataTips={dataTips}
      month={setMonth}
      year={setYear}
    />
  );
}
