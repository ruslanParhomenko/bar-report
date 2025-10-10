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

export const ArchiveForm = () => {
  const form = useForm();

  return (
    <Form {...form}>
      <ArchiveListTable nameTag={BREAK_LIST_ENDPOINT}>
        {(breakList, invalidate) => (
          <BreakList data={breakList} invalidate={invalidate} />
        )}
      </ArchiveListTable>
      <ArchiveListTable nameTag={REPORT_BAR_ENDPOINT}>
        {(report, invalidate) => (
          <ReportBar data={report} invalidate={invalidate} />
        )}
      </ArchiveListTable>
      <ArchiveListTable nameTag={REPORT_CUCINA_ENDPOINT}>
        {(report, invalidate) => (
          <ReportCucina data={report} invalidate={invalidate} />
        )}
      </ArchiveListTable>
      <ArchiveListTable nameTag={REMARKS_ENDPOINT}>
        {(remarks, invalidate) => (
          <Remarks data={remarks} invalidate={invalidate} />
        )}
      </ArchiveListTable>
    </Form>
  );
};
