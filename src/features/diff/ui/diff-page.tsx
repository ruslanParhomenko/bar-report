"use client";
import DiffSchedulePenalty from "@/features/diff/ui/diff-schedule-penalty";
import DiffScheduleTips from "@/features/diff/ui/diff-schedule-tips";
import DiffTipsOver from "@/features/diff/ui/duff-tips-over";
import { GetRemarksData } from "@/features/penalty/model/type";
import { GetScheduleData } from "@/features/schedule/schedule-edit/model/type";
import { GetTipsAddData } from "@/features/tips-add/model/type";

interface ArchiveData {
  penalty: GetRemarksData[] | null;
  tips: GetTipsAddData[] | null;
  schedule: GetScheduleData | null;
  tab: string;
}
interface DiffPageProps {
  archiveData: ArchiveData;
}

export function DiffPage({ archiveData }: DiffPageProps) {
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
    {
      key: "tips-over",
      render: () => (
        <DiffTipsOver
          dataTips={archiveData.tips}
          dataSchedule={archiveData.schedule}
        />
      ),
    },
  ];

  const activeTab = TABS.find((t) => t.key === archiveData.tab);

  return activeTab ? activeTab.render() : null;
}
