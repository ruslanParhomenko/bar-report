import {
  BREAK_LIST_ENDPOINT,
  REPORT_BAR_ENDPOINT,
  REPORT_CUCINA_ENDPOINT,
} from "@/constants/endpoint-tag";

import {
  BreakListData,
  ReportBarData,
  ReportCucinaData,
} from "@/constants/type";
import AccordionWrapper from "@/components/wrapper/AccordionWrapper";
import BreakList from "./BreakList";
import ReportBar from "./ReportBar";
import ReportCucina from "./ReportCucina";

export type ApiDataMap = BreakListData[] | ReportBarData[] | ReportCucinaData[];

interface ArchivePageProps {
  type: string | null;
  data: ApiDataMap;
}

export const ArchivePage = ({ type, data }: ArchivePageProps) => {
  return (
    <>
      <AccordionWrapper nameTag={BREAK_LIST_ENDPOINT}>
        <BreakList
          data={type === BREAK_LIST_ENDPOINT ? (data as BreakListData[]) : []}
        />
      </AccordionWrapper>

      <AccordionWrapper nameTag={REPORT_BAR_ENDPOINT}>
        <ReportBar
          data={type === REPORT_BAR_ENDPOINT ? (data as ReportBarData[]) : []}
        />
      </AccordionWrapper>

      <AccordionWrapper nameTag={REPORT_CUCINA_ENDPOINT}>
        <ReportCucina
          data={
            type === REPORT_CUCINA_ENDPOINT ? (data as ReportCucinaData[]) : []
          }
        />
      </AccordionWrapper>
    </>
  );
};
