"use server";

import { REMARKS_ACTION_TAG } from "@/constants/action-tag";
import { getYearMonthDoc } from "@/lib/firebase-doc";
import { updateTag } from "next/cache";
import { RemarksDataForm } from "../model/type";

const actionTag = REMARKS_ACTION_TAG;



export async function createPenalty(data: RemarksDataForm) {
  const { year, month, day, remarks } = data;
  const docRef = getYearMonthDoc(actionTag, year, month);
  const docRefByDay = docRef.collection("days").doc(day);

  await docRefByDay.set(remarks);

  updateTag(actionTag);
  return docRefByDay.id;
}


