"use server";

import { CashForm } from "@/features/cash/schema";
import { unstable_cache } from "next/cache";
import { updateTag } from "next/cache";
import { CASH_ACTION_TAG } from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";

// type
export type CashDataForm = {
  id: string;
  year: string;
  month: string;
  cashData: CashForm;
};

export type GetCashData = {
  id: string;
  cashData: CashForm;
};

// create
export async function createCash(data: Omit<CashDataForm, "id">) {
  const { year, month, cashData } = data;

  const docRef = dbAdmin
    .collection(CASH_ACTION_TAG)
    .doc(year)
    .collection("months")
    .doc(month);

  await docRef.set({ cashData });

  updateTag(CASH_ACTION_TAG);

  return docRef.id;
}

// get by month year
export async function _getCashByYearAndMonth(
  year: string,
  month: string,
): Promise<GetCashData | null> {
  const docRef = dbAdmin
    .collection(CASH_ACTION_TAG)
    .doc(year)
    .collection("months")
    .doc(month);

  const snap = await docRef.get();

  if (!snap.exists) return null;

  return { id: snap.id, ...snap.data() } as GetCashData;
}

// get by year

export async function getCashByYear(year: string) {
  const colRef = dbAdmin
    .collection(CASH_ACTION_TAG)
    .doc(year)
    .collection("months");

  const snap = await colRef.get();

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export const getCashByYearAndMonth = unstable_cache(
  _getCashByYearAndMonth,
  [CASH_ACTION_TAG],
  {
    revalidate: false,
    tags: [CASH_ACTION_TAG],
  },
);
