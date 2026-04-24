"use server";
import { FIN_CASH_ACTION_TAG } from "@/constants/action-tag";
import { FinForm } from "@/features/fin-cash/schema";
import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache, updateTag } from "next/cache";

// type
export type FinDataForm = {
  id: string;
  year: string;
  finData: FinForm;
};

export type GetFinData = Omit<FinDataForm, "year" | "month">;

const TAG = FIN_CASH_ACTION_TAG;
// create
export async function createFin(data: Omit<FinDataForm, "id">) {
  const { year, finData } = data;

  const docRef = dbAdmin.collection(TAG).doc(year);

  await docRef.set({ finData });

  updateTag(TAG);

  return docRef.id;
}

// get by year
export async function _getFinByYear(year: string) {
  const colRef = dbAdmin.collection(TAG).doc(year);

  const snap = await colRef.get();

  return {
    id: snap.id,
    ...snap.data(),
  } as GetFinData;
}

export const getFinByYear = unstable_cache(_getFinByYear, [TAG], {
  revalidate: false,
  tags: [TAG],
});
