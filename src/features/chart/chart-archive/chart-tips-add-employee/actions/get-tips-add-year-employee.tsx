"use server";

import { TIPS_ADD_ACTION_TAG } from "@/constants/action-tag";
import {
  GetTipsAddYearEmployee,
  TipsAddDayEmployees,
} from "@/features/chart/chart-archive/chart-tips-add-employee/model/type";
import { TipsAddForm } from "@/features/tips-add/model/schema";
import { getYearMonthDoc } from "@/lib/firebase-doc";
import { MONTHS } from "@/utils/get-month-days";
import { unstable_cache } from "next/dist/server/web/spec-extension/unstable-cache";

const actionTag = TIPS_ADD_ACTION_TAG;
async function _getTipsAddYearEmployee(
  year: string,
): Promise<GetTipsAddYearEmployee[]> {
  const docs = await Promise.all(
    MONTHS.map(async (month) => {
      const docRef = getYearMonthDoc(actionTag, year, month);
      const daysSnap = await docRef.collection("days").get();

      if (daysSnap.empty) return null;

      return {
        id: month,
        tipsAdd: daysSnap.docs.map((doc) => ({
          id: doc.id,
          currency: doc.data().currency,
          tipsAdd: doc
            .data()
            .tipsAdd.map((item: TipsAddForm): TipsAddDayEmployees => ({
              amount: item.amount.map((item) => ({
                value: item.value,
                typeAmount: item.typeAmount,
              })),
              employeeName: item.employeeName,
              idEmployee: item.idEmployee,
              resultAmount: item.resultAmount
                .reduce((acc, curr) => acc + +curr.value, 0)
                .toString(),
              role: item.role,
            })),
        })),
      };
    }),
  );

  return docs.filter((item): item is GetTipsAddYearEmployee => item !== null);
}

export const getTipsAddYearEmployee = unstable_cache(
  _getTipsAddYearEmployee,
  [actionTag],
  {
    revalidate: false,
    tags: [actionTag],
  },
);
