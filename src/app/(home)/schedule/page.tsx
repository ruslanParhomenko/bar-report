import {
  getScheduleByMonthYear,
  SchedulesContextValue,
} from "@/app/actions/schedule/schedule-action";
import SchedulePage from "@/features/schedule/schedule-page";
import { authOptions } from "@/lib/auth";
import ClientRefProvider from "@/providers/client-ref-provider";
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
  if (!month || !year) return null;

  const schedule = await getScheduleByMonthYear(month, year);

  return (
    <ClientRefProvider>
      <SchedulePage
        schedule={schedule as SchedulesContextValue[]}
        month={month}
        year={year}
        isView={isView}
      />
    </ClientRefProvider>
  );
}
