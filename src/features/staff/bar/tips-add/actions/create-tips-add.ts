"use server";

import { TIPS_ADD_ACTION_TAG } from "@/constants/action-tag";
import { getYearMonthDoc } from "@/lib/firebase-doc";
import { updateTag } from "next/cache";
import { TipsAddDataForm } from "../model/type";

const actionTag = TIPS_ADD_ACTION_TAG;



export async function createTipsAdd(data: TipsAddDataForm) {
  const { year, month, day, tipsAdd, currency } = data;
  const docRef = getYearMonthDoc(actionTag, year, month);
  const docRefByDay = docRef.collection("days").doc(day);

  await docRefByDay.set({
    currency,
    tipsAdd,
  });

  updateTag(actionTag);
  return docRefByDay.id;
}


