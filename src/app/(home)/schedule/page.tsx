import { getScheduleByMonthYear } from "@/app/actions/schedule/schedule-action";
import SchedulePage from "@/features/schedule/schedule-page";
import ClientRefProvider from "@/providers/client-ref-provider";
import { ValueParams } from "@/types/params";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const params = (await searchParams) as ValueParams;
  const { month, year, tab } = params;
  if (!month || !year || !tab) return null;

  const schedules = await getScheduleByMonthYear(month, year);

  const schedule = schedules?.find((s: any) => s.role === tab) ?? null;
  return (
    <ClientRefProvider>
      <SchedulePage schedule={schedule} params={params} />
    </ClientRefProvider>
  );
}
