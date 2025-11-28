import PageNav from "@/features/nav/PageNav";
import { REPORT_NAV_ITEMS } from "@/features/navigation/constants";

const ReportLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <PageNav navItems={REPORT_NAV_ITEMS} mainRoute={"reports"} />
      {children}
    </>
  );
};

export default ReportLayout;
