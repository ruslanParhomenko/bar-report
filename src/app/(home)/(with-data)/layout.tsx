import { getCashForm } from "@/app/actions/cash/cashAction";
import { getRemarks } from "@/app/actions/remarks/remarksAction";
import { getSchedule } from "@/app/actions/schedule/scheduleAction";
import { getTipsForm } from "@/app/actions/tips/tipsAction";
import { CashProvider } from "@/providers/CashProvider";
import { RemarksProvider } from "@/providers/RemarksProvider";
import {
  SchedulesContextValue,
  SchedulesProvider,
} from "@/providers/ScheduleProvider";
import { TipsProvider } from "@/providers/TipsProvider";

export default async function DataProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schedules = await getSchedule();
  const remarks = await getRemarks();
  const dataTips = await getTipsForm();
  const dataCash = await getCashForm();
  return (
    <SchedulesProvider schedules={schedules as SchedulesContextValue[]}>
      <RemarksProvider data={remarks.remarks}>
        <TipsProvider data={dataTips}>
          <CashProvider data={dataCash}>{children}</CashProvider>
        </TipsProvider>
      </RemarksProvider>
    </SchedulesProvider>
  );
}
