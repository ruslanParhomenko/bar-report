import {
  getScheduleByMonthYear,
  SchedulesContextValue,
} from "@/app/actions/schedule/scheduleAction";
import SchedulePage from "@/features/schedule/schedule-page";
import { authOptions } from "@/lib/auth";
import ClientRefProvider from "@/providers/ClientRefProvider";
import { getMonthDays, MONTHS } from "@/utils/getMonthDays";
import { getServerSession } from "next-auth";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const session = await getServerSession(authOptions);

  const isView =
    session?.user?.role === "ADMIN" || session?.user?.role === "MNGR";

  const { month, year } = await searchParams;

  const setMonth = month ?? MONTHS[new Date().getMonth()];
  const setYear = year ?? new Date().getFullYear().toString();

  const schedule = await getScheduleByMonthYear(setMonth, setYear);
  const monthDays = getMonthDays({ month: setMonth, year: setYear });

  return (
    <ClientRefProvider>
      <SchedulePage
        schedule={schedule as SchedulesContextValue[]}
        monthDays={monthDays}
        month={month}
        isView={isView}
      />
    </ClientRefProvider>
  );
}
