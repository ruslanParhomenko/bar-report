"use server";

import { AO_REPORT_ACTION_TAG } from "@/constants/action-tag";
import { getYearMonthDoc } from "@/lib/firebase-doc";
import { updateTag } from "next/cache";
import { AoDataForm } from "../model/type";

const actionTag = AO_REPORT_ACTION_TAG;

// create
export async function createAO(data: Omit<AoDataForm, "id">) {
  const { year, month, aoData } = data;
  const docRef = getYearMonthDoc(actionTag, year, month);
  await docRef.set({ aoData });
  updateTag(actionTag);
  return docRef.id;
}
