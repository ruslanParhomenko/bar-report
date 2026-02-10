"use client";

import { useState } from "react";
import { useAbility } from "@/providers/AbilityProvider";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DatePickerInput from "@/components/inputs/DatePickerInput";
import { ReportDataByUniqueKey } from "@/app/actions/report-bar/report-bar-action";
import ReportBarTable from "@/components/table/report-bar-table/ReportBarTable";
import { ReportCucinaDataByUniqueKey } from "@/app/actions/report-cucina/report-cucina-action";
import ReportCucinaTable from "@/components/table/report-cucina-table/ReportCucinaTable";
import { BreakGetType } from "@/app/actions/break/break-action";
import { BreakListArchive } from "../break/break-list-archive";
import { RemarksDataByUniqueKey } from "@/app/actions/remarks/remarks-action";
import PenaltyDetails from "../penalty/penalty-details";
import PenaltyGeneral from "../penalty/penalty-general";

type TabValue = "bar" | "cucina" | "breakList" | "penalty" | "penaltyResult";
export type ArchiveData = {
  bar: ReportDataByUniqueKey | null;
  cucina: ReportCucinaDataByUniqueKey | null;
  breakList: BreakGetType | null;
  penalty: RemarksDataByUniqueKey | null;
  penaltyResult: RemarksDataByUniqueKey | null;
};
export default function ArchivePage({
  archiveData,
}: {
  archiveData: ArchiveData;
}) {
  const { isBar, isAdmin, isManager, isUser, isCucina } = useAbility();
  const isDisabled = !(isAdmin || isBar || isManager || isUser || isCucina);

  const [tab, setTab] = useState<TabValue>("bar");

  const handleTabChange = (value: string) => {
    if (
      value === "bar" ||
      value === "cucina" ||
      value === "breakList" ||
      value === "penalty" ||
      value === "penaltyResult"
    ) {
      setTab(value);
    }
  };

  const navItems = [
    { label: "bar", value: "bar" },
    { label: "cucina", value: "cucina" },
    { label: "breakList", value: "breakList" },
    { label: "penalty", value: "penalty" },
    { label: "penaltyResult", value: "penaltyResult" },
  ];

  return (
    <Tabs value={tab} onValueChange={handleTabChange} className="flex-1">
      <div className="flex items-center justify-between my-2 px-4">
        <TabsList className="flex md:gap-2 h-8 w-120">
          {navItems.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className="hover:text-bl cursor-pointer w-1/5"
            >
              <span className="truncate block w-full text-xs md:text-md text-bl">
                {item.label}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <TabsContent value="bar" forceMount>
        <div className={tab !== "bar" ? "hidden" : ""}>
          <ReportBarTable data={archiveData.bar} />
        </div>
      </TabsContent>
      <TabsContent value="cucina" forceMount>
        <div className={tab !== "cucina" ? "hidden" : ""}>
          <ReportCucinaTable data={archiveData.cucina} />
        </div>
      </TabsContent>
      <TabsContent value="breakList" forceMount>
        <div className={tab !== "breakList" ? "hidden" : ""}>
          <BreakListArchive data={archiveData.breakList} />
        </div>
      </TabsContent>
      <TabsContent value="penalty" forceMount>
        <div className={tab !== "penalty" ? "hidden" : ""}>
          <PenaltyDetails data={archiveData.penalty} />
        </div>
      </TabsContent>
      <TabsContent value="penaltyResult" forceMount>
        <div className={tab !== "penaltyResult" ? "hidden" : ""}>
          <PenaltyGeneral data={archiveData.penaltyResult} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
