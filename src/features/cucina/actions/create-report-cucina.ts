"use server";
import { updateTag } from "next/cache";

import { getYearMonthDoc } from "@/lib/firebase-doc";

import { REPORT_CUCINA_ACTION_TAG } from "@/constants/action-tag";
import { KitchenDataForm } from "../model/type";

const actionTag = REPORT_CUCINA_ACTION_TAG;

export async function createReportCucina(data: KitchenDataForm) {
  const { year, month, day, report } = data;
  const docRef = getYearMonthDoc(actionTag, year, month);
  const docRefByDay = docRef.collection("days").doc(day);

  await docRefByDay.set({ report });

  updateTag(actionTag);
  return docRefByDay.id;
}
