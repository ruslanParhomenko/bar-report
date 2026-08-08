"use server";
import { REPORT_BAR_ACTION_TAG } from "@/constants/action-tag";
import { ReportBarForm } from "@/features/staff/bar/report/schema";
import { getYearMonthDoc } from "@/lib/firebase-doc";
import { unstable_cache, updateTag } from "next/cache";

const actionTag = REPORT_BAR_ACTION_TAG;
type ReportDataForm = {
  year: string;
  month: string;
  day: string;
  report: ReportBarForm;
};

export type GetReportData = {
  id: string;
  report: ReportBarForm;
};
// create
export async function createReportBar(data: ReportDataForm) {
  const { year, month, day, report } = data;
  const docRef = getYearMonthDoc(actionTag, year, month);
  const docRefByDay = docRef.collection("days").doc(day);

  await docRefByDay.set({ report });

  updateTag(actionTag);
  return docRefByDay.id;
}

// get by month year
async function _getReportBarByYearMonth(
  year: string,
  month: string,
): Promise<GetReportData[] | null> {
  const docRef = getYearMonthDoc(actionTag, year, month);
  const daysSnap = await docRef.collection("days").get();

  if (daysSnap.empty) return null;

  const reports = daysSnap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as { report: ReportBarForm }),
  }));

  return reports;
}

export const getReportBarByYearMonth = unstable_cache(
  _getReportBarByYearMonth,
  [actionTag],
  {
    revalidate: false,
    tags: [actionTag],
  },
);
