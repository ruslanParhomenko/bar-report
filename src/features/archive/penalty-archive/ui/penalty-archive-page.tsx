import NavTabs from "@/components/nav-tabs/nav-tabs";
import PenaltyArchiveListCard from "@/features/archive/penalty-archive/ui/list/penalty-archive-list-card";
import { PenaltyResult } from "@/features/archive/penalty-result";
import { GetRemarksData } from "@/features/penalty/model/type";

import { useState } from "react";

const NAV_TABS = ["list", "result-table"];
export function PenaltyArchivePage({
  data,
  isAdmin,
}: {
  data: GetRemarksData[] | null;
  isAdmin: boolean;
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

      {activeTab === "list" && (
        <PenaltyArchiveListCard data={data} isAdmin={isAdmin} />
      )}
      {activeTab === "result-table" && <PenaltyResult data={data} />}
    </div>
  );
}
