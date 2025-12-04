import TabsNavSchedule from "@/features/nav/TabsNavSchedule";
import { SCHEDULE_NAV_ITEMS } from "@/features/navigation/constants";

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TabsNavSchedule navItems={SCHEDULE_NAV_ITEMS} mainRoute={"schedule"} />

      {children}
    </>
  );
}
