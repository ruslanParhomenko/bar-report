"use server";

import { TIPS_ADD_ACTION_TAG } from "@/constants/action-tag";
import { GetTipsAddData } from "@/features/tips-add/model/type";
import { dbAdmin } from "@/lib/firebase-admin";
import { updateTag } from "next/cache";

const actionTag = TIPS_ADD_ACTION_TAG;

export async function makeDeleteTips(
  uniqueId: string,
  idEmployee: string,
  day: string,
  month: string,
  year: string,
): Promise<boolean | null> {
  const ref = dbAdmin
    .collection(actionTag)
    .doc(year)
    .collection("months")
    .doc(month)
    .collection("days")
    .doc(day);

  return dbAdmin.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) return null;

    const data = snap.data() as GetTipsAddData;
    let result: boolean | null = null;

    const tipsAdd = data.tipsAdd?.map((item) => {
      if (item.idEmployee !== idEmployee) return item;

      return {
        ...item,
        amount: item.amount?.map((a) => {
          if (a.uniqueId !== uniqueId) return a;
          result = !a.isDeleted;
          return { ...a, isDeleted: result };
        }),
      };
    });

    if (result === null) return null;

    tx.update(ref, { tipsAdd });
    updateTag(actionTag);
    return result;
  });
}
