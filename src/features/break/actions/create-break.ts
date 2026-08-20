"use server";

import { BREAK_ACTION_TAG } from "@/constants/action-tag";
import { getYearMonthDoc } from "@/lib/firebase-doc";
import { updateTag } from "next/cache";
import { BreakDataForm } from "../model/type";

const actionTag = BREAK_ACTION_TAG;


export async function createBreakList(data: BreakDataForm) {
  const { year, month, day, rows } = data;
  const docRef = getYearMonthDoc(actionTag, year, month);
  const docRefByDay = docRef.collection("days").doc(day);

  await docRefByDay.set({ rows });

  updateTag(actionTag);
  return docRefByDay.id;
}

