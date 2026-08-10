"use server";
import { unstable_cache } from "next/cache";

import { getYearMonthDoc } from "@/lib/firebase-doc";

import { REPORT_CUCINA_ACTION_TAG } from "@/constants/action-tag";
import { ReportKitchenForm } from "@/features/staff/cucina/model/schema";
import { GetKitchenData } from "../model/type";

const actionTag = REPORT_CUCINA_ACTION_TAG;

// get by month year
async function _getReportCucinaByYearMonth(
  year: string,
  month: string,
): Promise<GetKitchenData[] | null> {
  const docRef = getYearMonthDoc(actionTag, year, month);
  const daysSnap = await docRef.collection("days").get();

  if (daysSnap.empty) return null;

  const reports = daysSnap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as { report: Omit<ReportKitchenForm, "date"> }),
  }));

  return reports;
}

export const getReportCucinaByYearMonth = unstable_cache(
  _getReportCucinaByYearMonth,
  [actionTag],
  {
    revalidate: false,
    tags: [actionTag],
  },
);
