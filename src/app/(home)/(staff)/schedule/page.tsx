import { getEmployees } from "@/features/settings/create-employee/actions/get-employees";
import { SchedulePage } from "@/features/staff/schedule";
import { getScheduleByYearAndMonth } from "@/features/staff/schedule/schedule-edit/actions/get-schedule";
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
