"use server";

import { REMARKS_ACTION_TAG } from "@/constants/action-tag";
import { RemarksForm } from "@/features/bar/penalty/schema";
import { getYearMonthDoc } from "@/lib/firebase-doc";
import { unstable_cache, updateTag } from "next/cache";

const actionTag = REMARKS_ACTION_TAG;

type RemarksDataForm = {
  day: string;
  month: string;
  year: string;
  remarks: RemarksForm;
};

export type GetRemarksData = {
  id: string;
  remarks: RemarksForm["remarks"];
};

export async function createRemarks(data: RemarksDataForm) {
  const { year, month, day, remarks } = data;
  const docRef = getYearMonthDoc(actionTag, year, month);
  const docRefByDay = docRef.collection("days").doc(day);

  await docRefByDay.set(remarks);

  updateTag(actionTag);
  return docRefByDay.id;
}

// get by month year
async function _getRemarksByYearMonth(
  year: string,
  month: string,
): Promise<GetRemarksData[] | null> {
  const docRef = getYearMonthDoc(actionTag, year, month);
  const daysSnap = await docRef.collection("days").get();

  if (daysSnap.empty) return null;

  const remarks = daysSnap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as { remarks: RemarksForm["remarks"] }),
  }));

  return remarks;
}

export const getRemarksByYearMonth = unstable_cache(
  _getRemarksByYearMonth,
  [actionTag],
  {
    revalidate: false,
    tags: [actionTag],
  },
);

// get remarks by day
async function _getRemarksByDay(
  year: string,
  month: string,
  day: string,
): Promise<GetRemarksData | null> {
  const docRef = getYearMonthDoc(actionTag, year, month)
    .collection("days")
    .doc(day);

  const snap = await docRef.get();

  if (!snap.exists) return null;

  return { id: snap.id, ...snap.data() } as GetRemarksData;
}

export const getRemarksByDay = unstable_cache(_getRemarksByDay, [actionTag], {
  revalidate: false,
  tags: [actionTag],
});
