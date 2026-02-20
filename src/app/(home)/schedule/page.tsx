import {
  getScheduleByMonthYear,
  SchedulesContextValue,
} from "@/app/actions/schedule/schedule-action";
import SchedulePage from "@/features/schedule/schedule-page";
import { authOptions } from "@/lib/auth";
import ClientRefProvider from "@/providers/client-ref-provider";
import { MONTHS } from "@/utils/get-month-days";
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

  return (
    <ClientRefProvider>
      <SchedulePage
        schedule={schedule as SchedulesContextValue[]}
        month={setMonth}
        year={setYear}
        isView={isView}
      />
    </ClientRefProvider>
  );
}
