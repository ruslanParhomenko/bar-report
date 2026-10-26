import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { ADMIN } from "@/constants/roles";
import { SchedulePage } from "@/features/schedule";
import { getScheduleByYearAndMonth } from "@/features/schedule/schedule-edit/actions/get-schedule";
import { getEmployees } from "@/features/settings/create-employee/actions/get-employees";
import { authOptions } from "@/lib/auth";
import { MONTHS } from "@/utils/get-month-days";
import { getServerSession } from "next-auth";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { month, year } = await searchParams;
  if (!month || !year) return null;

  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === ADMIN;

  if (!isAdmin) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const requestedYear = parseInt(year);
    const requestedMonth = MONTHS.indexOf(month) + 1;

    const isCurrentYearOrNext =
      requestedYear === currentYear &&
      (requestedMonth === currentMonth || requestedMonth === currentMonth + 1);

    if (!isCurrentYearOrNext) {
      return <InsufficientRights />;
    }
  }

  const [schedules, employees] = await Promise.allSettled([
    getScheduleByYearAndMonth(year, month),
    getEmployees(),
  ]);

  return (
    <SchedulePage
      schedules={schedules.status === "fulfilled" ? schedules.value : null}
      isAdmin={isAdmin}
      employees={employees.status === "fulfilled" ? employees.value : []}
    />
  );
}
