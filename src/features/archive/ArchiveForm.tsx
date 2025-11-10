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
import { Skeleton } from "@/components/ui/skeleton";

export enum DataObjectApi {
  BreakList = "breakList",
  Report = "dailyReport",
  ReportCucina = "dailyReportCucina",
}
export type ApiDataMap = {
  [DataObjectApi.BreakList]: BreakListData[];
  [DataObjectApi.Report]: ReportBarData[];
  [DataObjectApi.ReportCucina]: ReportCucinaData[];
};

export const ArchivePage = ({ data }: { data: ApiDataMap }) => {
  return data ? (
    <>
      <AccordionWrapper nameTag={BREAK_LIST_ENDPOINT}>
        <BreakList data={data.breakList} />
      </AccordionWrapper>

      <AccordionWrapper nameTag={REPORT_BAR_ENDPOINT}>
        <ReportBar data={data.dailyReport} />
      </AccordionWrapper>

      <AccordionWrapper nameTag={REPORT_CUCINA_ENDPOINT}>
        <ReportCucina data={data.dailyReportCucina} />
      </AccordionWrapper>
    </>
  ) : (
    <Skeleton />
  );
};
