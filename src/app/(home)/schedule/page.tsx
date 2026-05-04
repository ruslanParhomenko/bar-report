import { getScheduleByMonthYear } from "@/app/actions/schedule/schedule-action";
import { ProtectedPage } from "@/components/wrapper/protected-page";
import { SCHEDULE_MAIN_ROUTE } from "@/constants/endpoint-tag";
import SchedulePage from "@/features/schedule/schedule-page";
import { ValueParams } from "@/types/params";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const params = (await searchParams) as ValueParams;
  const { month, year } = params;
  if (!month || !year) return null;
  const schedules = (await getScheduleByMonthYear(month, year)) ?? null;
  return (
    <ProtectedPage route={SCHEDULE_MAIN_ROUTE}>
      <SchedulePage schedules={schedules} />
    </ProtectedPage>
  );
}
