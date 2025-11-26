import PageNavTabs from "@/features/nav/TabsNav";
import { SCHEDULE_NAV_ITEMS } from "@/features/navigation/constants";

const ScheduleLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <PageNavTabs navItems={SCHEDULE_NAV_ITEMS} mainRoute={"schedule"} />
      {children}
    </>
  );
};

export default ScheduleLayout;
