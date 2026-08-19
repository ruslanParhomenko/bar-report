import { SchedulePage } from "@/features/staff/schedule";
import { getScheduleByYearAndMonth } from "@/features/staff/schedule/actions/get-schedule";
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

  return <SchedulePage schedules={schedules} isAdmin={isAdmin} />;
}
