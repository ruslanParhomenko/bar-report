"use client";
import { ArhiveListTable } from "./ArchiveListTable";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import BreakListTable from "./BreakListTable";
import ReportTable from "./ReportCucinaTable";
import RemarkTable from "./RemarkTable";
import { ReportBarTable } from "./ReportBarTable";
import {
  BREAK_LIST_ENDPOINT,
  REMARKS_ENDPOINT,
  REPORT_BAR_ENDPOINT,
  REPORT_CUCINA_ENDPOINT,
} from "@/constants/endpoint-tag";

export const ArchiveForm = () => {
  const form = useForm();

  return (
    <Form {...form}>
      <ArhiveListTable nameTag={BREAK_LIST_ENDPOINT}>
        {(breakList, invalidate) => (
          <BreakListTable data={breakList} invalidate={invalidate} />
        )}
      </ArhiveListTable>
      <ArhiveListTable nameTag={REPORT_BAR_ENDPOINT}>
        {(report, invalidate) => (
          <ReportBarTable data={report} invalidate={invalidate} />
        )}
      </ArhiveListTable>
      <ArhiveListTable nameTag={REPORT_CUCINA_ENDPOINT}>
        {(report, invalidate) => (
          <ReportTable data={report} invalidate={invalidate} />
        )}
      </ArhiveListTable>
      <ArhiveListTable nameTag={REMARKS_ENDPOINT}>
        {(remarks, invalidate) => <RemarkTable data={remarks} />}
      </ArhiveListTable>
    </Form>
  );
};
