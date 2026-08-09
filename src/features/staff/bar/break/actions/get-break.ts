"use server";

import { BREAK_ACTION_TAG } from "@/constants/action-tag";
import { getYearMonthDoc } from "@/lib/firebase-doc";
import { unstable_cache} from "next/cache";
import { GetBreakData } from "../model/type";

const actionTag = BREAK_ACTION_TAG;


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
    ...(doc.data() as { rows: GetBreakData["rows"] }),
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
