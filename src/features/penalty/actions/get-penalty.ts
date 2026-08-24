"use server";

import { REMARKS_ACTION_TAG } from "@/constants/action-tag";
import { RemarksForm } from "@/features/penalty/model/schema";
import type {
  GetRemarksData,
  GetRemarksYearData,
} from "@/features/penalty/model/type";
import { getYearMonthDoc } from "@/lib/firebase-doc";
import { MONTHS } from "@/utils/get-month-days";
import { unstable_cache } from "next/cache";

const actionTag = REMARKS_ACTION_TAG;

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

// get by year

async function _getRemarksByYear(year: string): Promise<GetRemarksYearData[]> {
  const docs = await Promise.all(
    MONTHS.map(async (month) => {
      const docRef = getYearMonthDoc(actionTag, year, month);
      const daysSnap = await docRef.collection("days").get();

      if (daysSnap.empty) return null;

      return {
        id: month,
        remarks: daysSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      };
    }),
  );

  return docs.filter((item): item is GetRemarksYearData => item !== null);
}

export const getRemarksByYear = unstable_cache(_getRemarksByYear, [actionTag], {
  revalidate: false,
  tags: [actionTag],
});
