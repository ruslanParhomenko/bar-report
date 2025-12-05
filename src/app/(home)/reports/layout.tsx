import TabsMenuReports from "@/features/report/TabsMenuReports";

const ReportLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <TabsMenuReports />
      {children}
    </>
  );
};

export default ReportLayout;
