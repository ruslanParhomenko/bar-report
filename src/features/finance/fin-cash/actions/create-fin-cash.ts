"use server";
import {
  FIN_BAR_ACTION_TAG,
  FIN_CASH_ACTION_TAG,
} from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";
import { updateTag } from "next/cache";
import { FinDataForm } from "../model/type";

// type

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
