import { getRemarks } from "@/app/actions/remarks/remarksAction";
import {
  getSchedule,
  SchedulesContextValue,
} from "@/app/actions/schedule/scheduleAction";
import { getTipsForm, TipsData } from "@/app/actions/tips/tipsAction";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { remarksByUniqueEmployee } from "@/features/penalty/utils";
import { PageResult } from "@/features/result/PageResult";
import { getRemarksByMonth } from "@/features/result/utils";
import { authOptions } from "@/lib/auth";
import { MONTHS } from "@/utils/getMonthDays";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
const ROLE = {
  barmen: "bar",
  waiters: "bar",
  dish: "dish",
  cucina: "cucina",
};

const SET_ACCESS = ["ADMIN", "MNGR"];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { role, month, year } = await searchParams;
  // access control
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if (!SET_ACCESS.includes(session.user?.role ?? "")) {
    return <InsufficientRights />;
  }
  // key
  const uniqueKey = `${year}-${month}`;
  const uniqueKeySchedule = `${uniqueKey}-${
    ROLE[role as keyof typeof ROLE] as string
  }`;

  const [schedule, remarks, tips] = await Promise.all([
    getSchedule(),
    getRemarks(),
    getTipsForm(),
  ]);
  const dataSchedule = schedule.filter(
    (item: any) => item.uniqueKey === uniqueKeySchedule
  );
  const remarksByMonth =
    remarks && getRemarksByMonth(remarks, uniqueKey, MONTHS);
  const remarksByEmployee =
    remarksByUniqueEmployee(remarksByMonth).formattedData;
  const dataTips =
    tips.find((item: TipsData) => item.unique_id === uniqueKey)?.form_data ??
    null;

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
