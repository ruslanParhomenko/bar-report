import PageNav from "@/features/nav/PageNav";
import { SHEDULE_NAV_ITEMS } from "@/features/navigation/constants";

const SheduleLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-background">
      <PageNav navItems={SHEDULE_NAV_ITEMS} mainRoute={"schedule"} />
      {children}
    </div>
  );
};

export default SheduleLayout;
