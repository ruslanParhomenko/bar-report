"use server";

import { BREAK_ACTION_TAG } from "@/constants/action-tag";
import { BreakForm } from "@/features/bar/break-form/schema";
import { getYearMonthDoc } from "@/lib/firebase-doc";
import { unstable_cache, updateTag } from "next/cache";

const actionTag = BREAK_ACTION_TAG;

type BreakDataForm = {
  day: string;
  month: string;
  year: string;
  rows: BreakForm["rows"];
};

export type GetBreakData = {
  id: string;
  rows: BreakForm["rows"];
};
// create break list

export async function createBreakList(data: BreakDataForm) {
  const { year, month, day, rows } = data;
  const docRef = getYearMonthDoc(actionTag, year, month);
  const docRefByDay = docRef.collection("days").doc(day);

  await docRefByDay.set({ rows });

  updateTag(actionTag);
  return docRefByDay.id;
}

// get by month year
async function _getBreakListByYearMonth(
  year: string,
  month: string,
): Promise<GetBreakData[] | null> {
  const docRef = getYearMonthDoc(actionTag, year, month);
  const daysSnap = await docRef.collection("days").get();

  if (daysSnap.empty) return null;

  const rows = daysSnap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as { rows: BreakForm["rows"] }),
  }));

  return rows;
}

export const getBreakListByYearMonth = unstable_cache(
  _getBreakListByYearMonth,
  [actionTag],
  {
    revalidate: false,
    tags: [actionTag],
  },
);
