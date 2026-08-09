"use server";
import { REPORT_BAR_ACTION_TAG } from "@/constants/action-tag";
import { getYearMonthDoc } from "@/lib/firebase-doc";
import { unstable_cache} from "next/cache";
import { GetReportData } from "../model/type";

const actionTag = REPORT_BAR_ACTION_TAG;

async function _getReportBarByYearMonth(
  year: string,
  month: string,
): Promise<GetReportData[] | null> {
  const docRef = getYearMonthDoc(actionTag, year, month);
  const daysSnap = await docRef.collection("days").get();

  if (daysSnap.empty) return null;

  const reports = daysSnap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as { report: GetReportData["report"] }),
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
