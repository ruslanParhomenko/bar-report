import NavTabs from "@/components/nav-tabs/nav-tabs";
import TipsArchiveDataList from "@/features/archive/tips-archive/ui/tips-data-list";
import TipsArchiveDataTable from "@/features/archive/tips-archive/ui/tips-data-table";
import { GetTipsAddData } from "@/features/tips-add/model/type";

import { useState } from "react";

const NAV_TABS = ["list", "table"];
export function TipsArchivePage({ data }: { data: GetTipsAddData[] | null }) {
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

      {activeTab === "list" && <TipsArchiveDataList data={data} />}
      {activeTab === "table" && <TipsArchiveDataTable data={data} />}
    </div>
  );
}
