import {
  getSchedule,
  SchedulesContextValue,
} from "@/app/actions/schedule/scheduleAction";
import SchedulePage from "@/features/schedule/SchedulePage";
import { authOptions } from "@/lib/auth";
import ClientRefProvider from "@/providers/ClientRefProvider";
import { getMonthDays } from "@/utils/getMonthDays";
import { getServerSession } from "next-auth";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ patch: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { patch } = await params;
  const { month, year } = await searchParams;

  const session = await getServerSession(authOptions);

  const isView =
    session?.user?.role === "ADMIN" || session?.user?.role === "MNGR";

  const uniqueKey = `${year}-${month}-${patch}`;
  const schedule = (await getSchedule()).find(
    (s: any) => s.uniqueKey === uniqueKey
  );
  const monthDays = getMonthDays({ month: month, year: year });

  return (
    <ClientRefProvider>
      <SchedulePage
        schedule={schedule as SchedulesContextValue}
        monthDays={monthDays}
        month={month}
        isView={isView}
      />
    </ClientRefProvider>
  );
}
