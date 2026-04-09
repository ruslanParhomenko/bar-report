import { getScheduleByMonthYear } from "@/app/actions/schedule/schedule-action";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { SCHEDULE_MAIN_ROUTE } from "@/constants/endpoint-tag";
import SchedulePage from "@/features/schedule/schedule-page";
import { checkAccess } from "@/lib/check-access";
import ClientRefProvider from "@/providers/client-ref-provider";
import { ValueParams } from "@/types/params";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const hasAccess = await checkAccess(SCHEDULE_MAIN_ROUTE);
  if (!hasAccess) return <InsufficientRights />;
  const params = (await searchParams) as ValueParams;
  const { month, year } = params;
  if (!month || !year) return null;
  const schedules = (await getScheduleByMonthYear(month, year)) ?? null;
  return (
    <ClientRefProvider>
      <SchedulePage schedules={schedules} params={params} swapsList={null} />
    </ClientRefProvider>
  );
}
