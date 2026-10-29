import NavTabs from "@/components/nav-tabs/nav-tabs";
import { BreakListArchive } from "@/features/archive/break-archive/ui/break-list-archive";
import { BreakTableArchive } from "@/features/archive/break-archive/ui/break-table-archive";
import { GetBreakData } from "@/features/break/model/type";

import { useState } from "react";

const NAV_TABS = ["list", "table"];
export function BreakArchivePage({ data }: { data: GetBreakData[] | null }) {
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

      {activeTab === "list" && <BreakListArchive data={data} />}
      {activeTab === "table" && <BreakTableArchive data={data} />}
    </div>
  );
}
