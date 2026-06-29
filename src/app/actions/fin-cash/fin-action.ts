"use server";
import {
  FIN_BAR_ACTION_TAG,
  FIN_CASH_ACTION_TAG,
} from "@/constants/action-tag";
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
const TAG_BAR = FIN_BAR_ACTION_TAG;

// create nori
export async function createFin(data: Omit<FinDataForm, "id">) {
  const { year, finData } = data;

  const docRef = dbAdmin.collection(TAG).doc(year);

  await docRef.set({ finData });

  updateTag(TAG);

  return docRef.id;
}

// bar
export async function createFinBar(data: Omit<FinDataForm, "id">) {
  const { year, finData } = data;

  const docRef = dbAdmin.collection(TAG_BAR).doc(year);

  await docRef.set({ finData });

  updateTag(TAG_BAR);

  return docRef.id;
}
// get by year  nori
export async function _getFinByYear(year: string) {
  const colRef = dbAdmin.collection(TAG).doc(year);

  const snap = await colRef.get();

  if (!snap.exists) return null;

  return {
    id: snap.id,
    ...snap.data(),
  } as GetFinData;
}

export const getFinByYear = unstable_cache(_getFinByYear, [TAG, "year"], {
  revalidate: false,
  tags: [TAG],
});

// bar

export async function _getFinBarByYear(year: string) {
  const colRef = dbAdmin.collection(TAG_BAR).doc(year);

  const snap = await colRef.get();

  if (!snap.exists) return null;

  return {
    id: snap.id,
    ...snap.data(),
  } as GetFinData;
}

export const getFinBarByYear = unstable_cache(
  _getFinBarByYear,
  [TAG_BAR, "year"],
  {
    revalidate: false,
    tags: [TAG_BAR],
  },
);
