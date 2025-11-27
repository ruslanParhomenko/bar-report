import { Spinner } from "@/components/ui/spinner";
import { SCHEDULE_NAV_ITEMS } from "@/features/navigation/constants";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const PageNavTabs = dynamic(() => import("@/features/nav/TabsNav"));

const ScheduleLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Suspense fallback={<Spinner />}>
        <PageNavTabs navItems={SCHEDULE_NAV_ITEMS} mainRoute={"schedule"} />
      </Suspense>
      {children}
    </>
  );
};

export default ScheduleLayout;
