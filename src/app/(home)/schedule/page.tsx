import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { SchedulePage } from "@/features/schedule";
import { getScheduleByYearAndMonth } from "@/features/schedule/schedule-edit/actions/get-schedule";
import { getEmployees } from "@/features/settings/create-employee/actions/get-employees";
import { MONTHS } from "@/utils/get-month-days";
import { headers } from "next/headers";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { month, year } = await searchParams;

  const headerStore = await headers();
  const isAdmin = headerStore.get("x-is-admin") === "true";

  if (!month || !year) return null;

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

  const schedules = await getScheduleByYearAndMonth(year, month);
  const employees = await getEmployees();

  return (
    <SchedulePage
      schedules={schedules}
      isAdmin={isAdmin}
      employees={employees}
    />
  );
}
