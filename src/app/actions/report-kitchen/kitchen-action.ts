"use server";
import { REPORT_CUCINA_ACTION_TAG } from "@/constants/action-tag";

import { ReportKitchenForm } from "@/features/cucina/schema";
import { getYearMonthDoc } from "@/lib/firebase-doc";
import { unstable_cache, updateTag } from "next/cache";

const actionTag = REPORT_CUCINA_ACTION_TAG;

type KitchenDataForm = {
  year: string;
  month: string;
  day: string;
  report: Omit<ReportKitchenForm, "date">;
};

export type GetKitchenData = {
  id: string;
  report: Omit<ReportKitchenForm, "date">;
};
// create
export async function createReportKitchen(data: KitchenDataForm) {
  const { year, month, day, report } = data;
  const docRef = getYearMonthDoc(actionTag, year, month);
  const docRefByDay = docRef.collection("days").doc(day);

  await docRefByDay.set({ report });

  updateTag(actionTag);
  return docRefByDay.id;
}

// get by month year
async function _getReportKitchenByYearMonth(
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

export const getReportKitchenByYearMonth = unstable_cache(
  _getReportKitchenByYearMonth,
  [actionTag],
  {
    revalidate: false,
    tags: [actionTag],
  },
);
