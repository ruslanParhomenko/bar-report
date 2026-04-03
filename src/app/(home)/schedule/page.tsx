import { getScheduleByMonthYear } from "@/app/actions/schedule/schedule-action";
import { getSwapsByKey } from "@/app/actions/swap-schedule/swap-actions";
import SchedulePage from "@/features/schedule/schedule-page";
import ClientRefProvider from "@/providers/client-ref-provider";
import { ValueParams } from "@/types/params";
import { MONTHS } from "@/utils/get-month-days";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const params = (await searchParams) as ValueParams;
  const { month, year } = params;
  if (!month || !year) return null;

  const monthNum = MONTHS.indexOf(month) + 1;

  const schedules = (await getScheduleByMonthYear(month, year)) ?? null;
  const swapsList = (await getSwapsByKey(`${year}-${monthNum}`)) ?? null;
  return (
    <ClientRefProvider>
      <SchedulePage
        schedules={schedules}
        params={params}
        swapsList={swapsList}
      />
    </ClientRefProvider>
  );
}
