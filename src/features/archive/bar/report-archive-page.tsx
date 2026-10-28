import NavTabs from "@/components/nav-tabs/nav-tabs";
import ReportBarCardList from "@/features/archive/bar/ui/card/report-bar-card-list";
import { ReportBarExpensesTable } from "@/features/archive/bar/ui/table/report-bar-expenses-table";
import { ReportBarInventoryTable } from "@/features/archive/bar/ui/table/report-bar-inventory-table";
import { GetReportData } from "@/features/report-bar/model/type";

import { useState } from "react";

const NAV_TABS = ["list", "inventory-table", "expenses-table"];
export function ReportBarArchivePage({
  data,
}: {
  data: GetReportData[] | null;
}) {
  if (!data) return null;

  const [activeTab, setActiveTab] = useState(NAV_TABS[0]);

  return (
    <div className="flex flex-col gap-1">
      <div className="bg-background sticky top-0 z-20">
        <NavTabs
          navItems={NAV_TABS}
          activeTab={activeTab}
          handleTabChange={setActiveTab}
          classTrigger="text-xs h-5 shadow-none!"
          classTabs="text-xs h-6 bg-transparent tracking-wider"
        />
      </div>

      {activeTab === "list" && <ReportBarCardList data={data} />}
      {activeTab === "inventory-table" && (
        <ReportBarInventoryTable data={data} />
      )}
      {activeTab === "expenses-table" && <ReportBarExpensesTable data={data} />}
    </div>
  );
}
