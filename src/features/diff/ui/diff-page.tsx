"use client";

import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import DiffSchedulePenalty from "@/features/diff/ui/diff-schedule-penalty";
import DiffScheduleTips from "@/features/diff/ui/diff-schedule-tips";
import { GetRemarksData } from "@/features/penalty/model/type";
import { GetScheduleData } from "@/features/schedule/schedule-edit/model/type";
import { GetTipsAddData } from "@/features/tips-add/model/type";
import { useAccessCheck } from "@/hooks/use-tab-access";
import { useSearchParams } from "next/navigation";

interface ArchiveData {
  penalty: GetRemarksData[] | null;
  tips: GetTipsAddData[] | null;
  schedule: GetScheduleData | null;
}
interface DiffPageProps {
  archiveData: ArchiveData;
}

export function DiffPage({ archiveData }: DiffPageProps) {
  const hasAccess = useAccessCheck();
  const tab = useSearchParams().get("tab");

  const TABS = [
    {
      key: "schedule-tips",
      render: () => (
        <DiffScheduleTips
          dataTips={archiveData.tips}
          dataSchedule={archiveData.schedule}
        />
      ),
    },
    {
      key: "schedule-penalty",
      render: () => (
        <DiffSchedulePenalty
          dataPenalty={archiveData.penalty}
          dataSchedule={archiveData.schedule}
        />
      ),
    },
  ];

  const activeTab = TABS.find((t) => t.key === tab);

  if (!hasAccess) return <InsufficientRights />;

  return activeTab ? activeTab.render() : null;
}
