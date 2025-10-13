"use client";
import { ArchiveListTable } from "./ArchiveListTable";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

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
import { getSelectByName } from "./helpers";
import { DATA_FILTER } from "./constant";

enum dataObjectApi {
  breakList = "breakeList",
  report = "dailyReport",
  "report-cucina" = "dailyReportCucina",
  remarks = "remarkReport",
}

export const ArchiveForm = ({
  data,
  onInvalidate,
}: {
  data: any;
  onInvalidate: () => void;
}) => {
  const form = useForm();

  return (
    <Form {...form}>
      <ArchiveListTable
        nameTag={BREAK_LIST_ENDPOINT}
        data={data[dataObjectApi[BREAK_LIST_ENDPOINT]]}
        options={getSelectByName(data?.breakeList || [], "rows")}
      >
        {(breakList) => (
          <BreakList data={breakList} invalidate={onInvalidate} />
        )}
      </ArchiveListTable>
      <ArchiveListTable
        nameTag={REPORT_BAR_ENDPOINT}
        data={data[dataObjectApi[REPORT_BAR_ENDPOINT]]}
        options={DATA_FILTER[REPORT_BAR_ENDPOINT]}
      >
        {(report) => <ReportBar data={report} invalidate={onInvalidate} />}
      </ArchiveListTable>
      <ArchiveListTable
        nameTag={REPORT_CUCINA_ENDPOINT}
        data={data[dataObjectApi[REPORT_CUCINA_ENDPOINT]]}
        options={DATA_FILTER[REPORT_CUCINA_ENDPOINT]}
      >
        {(report) => <ReportCucina data={report} invalidate={onInvalidate} />}
      </ArchiveListTable>
      <ArchiveListTable
        nameTag={REMARKS_ENDPOINT}
        data={data[dataObjectApi[REMARKS_ENDPOINT]]}
        options={getSelectByName(data?.remarkReport || [], "remarks")}
      >
        {(remarks) => <Remarks data={remarks} invalidate={onInvalidate} />}
      </ArchiveListTable>
    </Form>
  );
};
