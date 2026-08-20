"use server";
import { REPORT_BAR_ACTION_TAG } from "@/constants/action-tag";
import { getYearMonthDoc } from "@/lib/firebase-doc";
import {  updateTag } from "next/cache";
import { ReportDataForm } from "../model/type";

const actionTag = REPORT_BAR_ACTION_TAG;

// create
export async function createReportBar(data: ReportDataForm) {
  const { year, month, day, report } = data;
  const docRef = getYearMonthDoc(actionTag, year, month);
  const docRefByDay = docRef.collection("days").doc(day);

  await docRefByDay.set({ report });

  updateTag(actionTag);
  return docRefByDay.id;
}


