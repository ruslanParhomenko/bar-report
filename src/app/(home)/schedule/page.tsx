import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { ADMIN } from "@/constants/roles";
import { SCHEDULE_MAIN_ROUTE } from "@/constants/route-tag";
import { SchedulePage } from "@/features/schedule";
import { getScheduleByYearAndMonth } from "@/features/schedule/schedule-edit/actions/get-schedule";
import { getEmployees } from "@/features/settings/create-employee/actions/get-employees";
import { requireTabAccess } from "@/lib/access";
import { canViewSchedule } from "@/utils/can-access-period";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { month, year, tab } = await searchParams;
  if (!month || !year || !tab) return null;

  const { user } = await requireTabAccess(SCHEDULE_MAIN_ROUTE, tab);

  if (!user) {
    return <InsufficientRights />;
  }

  const isAdmin = user?.role === ADMIN;

  if (!canViewSchedule(year, month, 0, 1) && !isAdmin) {
    return <InsufficientRights />;
  }

  const [schedules, employees] = await Promise.allSettled([
    getScheduleByYearAndMonth(year, month),
    getEmployees(),
  ]);

  const schedulesData =
    schedules.status === "fulfilled" ? schedules.value : null;

  const scheduleData = schedulesData?.find((s) => s.id === tab) ?? null;

  if (!scheduleData) return null;

  return (
    <SchedulePage
      schedule={scheduleData}
      isAdmin={isAdmin}
      employees={employees.status === "fulfilled" ? employees.value : []}
    />
  );
}
