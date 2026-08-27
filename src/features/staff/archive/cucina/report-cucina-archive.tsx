"use client";

import ReportCucinaArchiveItem from "@/features/staff/archive/cucina/report-cucina-archive-item";
import { GetKitchenData } from "@/features/staff/cucina/model/type";

export default function ReportCucinaArchive({
  data,
}: {
  data: GetKitchenData[] | null;
}) {
  if (!data) return null;
  const sortedData = [...data].sort((a, b) => Number(b.id) - Number(a.id));
  return (
    <>
      {sortedData.map((item, index) => (
        <ReportCucinaArchiveItem
          key={item.id}
          data={item}
          defaultOpen={index === 0}
        />
      ))}
    </>
  );
}
