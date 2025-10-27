"use client";
import {
  BREAK_LIST_ENDPOINT,
  REMARKS_ENDPOINT,
  REPORT_BAR_ENDPOINT,
  REPORT_CUCINA_ENDPOINT,
} from "@/constants/endpoint-tag";

import {
  BreakListData,
  RemarkData,
  ReportBarData,
  ReportCucinaData,
} from "@/constants/type";
import AccordionWrapper from "@/components/wrapper/AccordionWrapper";
import dynamic from "next/dynamic";
import { useArchive } from "@/hooks/useApiArchive";
import { Skeleton } from "@/components/ui/skeleton";

const BreakList = dynamic(() => import("@/features/archive/BreakList"));
const ReportBar = dynamic(() => import("@/features/archive/ReportBar"));
const ReportCucina = dynamic(() => import("@/features/archive/ReportCucina"));
const Remarks = dynamic(() => import("@/features/archive/Remarks"));

export enum DataObjectApi {
  BreakList = "breakList",
  Report = "dailyReport",
  ReportCucina = "dailyReportCucina",
  Remarks = "remarkReport",
}
export type ApiDataMap = {
  [DataObjectApi.BreakList]: BreakListData[];
  [DataObjectApi.Report]: ReportBarData[];
  [DataObjectApi.ReportCucina]: ReportCucinaData[];
  [DataObjectApi.Remarks]: RemarkData[];
};

export const ArchivePage = ({
  data,
  onInvalidate,
}: {
  data: ApiDataMap;
  onInvalidate?: () => void;
}) => {
  // const { data, invalidate: onInvalidate } = useArchive();
  console.log(data);
  if (!data) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-1/3 rounded-lg" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }
  return (
    <>
      <AccordionWrapper nameTag={BREAK_LIST_ENDPOINT}>
        <BreakList data={data.breakList} invalidate={onInvalidate} />
      </AccordionWrapper>

      <AccordionWrapper nameTag={REPORT_BAR_ENDPOINT}>
        <ReportBar data={data.dailyReport} invalidate={onInvalidate} />
      </AccordionWrapper>

      <AccordionWrapper nameTag={REPORT_CUCINA_ENDPOINT}>
        <ReportCucina data={data.dailyReportCucina} invalidate={onInvalidate} />
      </AccordionWrapper>

      <AccordionWrapper nameTag={REMARKS_ENDPOINT}>
        <Remarks data={data.remarkReport} invalidate={onInvalidate} />
      </AccordionWrapper>
    </>
  );
};
