import dynamic from "next/dynamic";

const ScheduleTableBody = dynamic(() => import("./ScheduleTableBody"));

export function SchedulePage({ patch }: { patch: string }) {
  return <ScheduleTableBody patch={patch} />;
}
