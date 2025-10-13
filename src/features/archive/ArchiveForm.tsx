import {
  BREAK_LIST_ENDPOINT,
  REMARKS_ENDPOINT,
  REPORT_BAR_ENDPOINT,
  REPORT_CUCINA_ENDPOINT,
} from "@/constants/endpoint-tag";
import Remarks from "./Remarks";
import BreakList from "./BreakList";
import ReportBar from "./ReportBar";
import ReportCucina from "./ReportCucina";
import {
  BreakListData,
  RemarkData,
  ReportBarData,
  ReportCucinaData,
} from "@/constants/type";
import AccordionWrapper from "@/components/wrapper/AccordionWrapper";

export enum DataObjectApi {
  BreakList = "breakeList",
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

export const ArchiveForm = ({
  data,
  onInvalidate,
}: {
  data: ApiDataMap;
  onInvalidate: () => void;
}) => {
  return (
    <>
      <AccordionWrapper nameTag={BREAK_LIST_ENDPOINT}>
        <BreakList data={data.breakeList} invalidate={onInvalidate} />
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
