import { getScheduleByMonthYear } from "@/app/actions/schedule/schedule-action";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { SCHEDULE_MAIN_ROUTE } from "@/constants/endpoint-tag";
import { SIDEBAR_NAVIGATION } from "@/constants/sidebar-nav";
// import { getSwapsByKey } from "@/app/actions/swap-schedule/swap-actions";
import SchedulePage from "@/features/schedule/schedule-page";
import { checkAccess } from "@/lib/check-access";
import ClientRefProvider from "@/providers/client-ref-provider";
import { ValueParams } from "@/types/params";
// import { MONTHS } from "@/utils/get-month-days";

const SET_ACCESS =
  SIDEBAR_NAVIGATION.find((item) => item.title === SCHEDULE_MAIN_ROUTE)
    ?.setAcces || [];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;
  const params = (await searchParams) as ValueParams;
  const { month, year } = params;
  if (!month || !year) return null;

  // const monthNum = MONTHS.indexOf(month) + 1;

  const schedules = (await getScheduleByMonthYear(month, year)) ?? null;
  // const swapsList = (await getSwapsByKey(`${year}-${monthNum}`)) ?? null;
  return (
    <ClientRefProvider>
      <SchedulePage schedules={schedules} params={params} swapsList={null} />
    </ClientRefProvider>
  );
}
