import { getScheduleByMonthYear } from "@/app/actions/schedule/schedule-action";
import SchedulePage from "@/features/schedule/schedule-page";
import ClientRefProvider from "@/providers/client-ref-provider";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { month, year, tab } = await searchParams;
  if (!month || !year || !tab) return null;

  const schedule =
    (await getScheduleByMonthYear(month, year)).find(
      (s: any) => s.role === tab,
    ) || null;

  return (
    <ClientRefProvider>
      <SchedulePage schedule={schedule} month={month} year={year} />
    </ClientRefProvider>
  );
}
