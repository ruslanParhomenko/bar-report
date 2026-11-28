"use server";
import { TECH_CARD_ACTION_TAG } from "@/constants/action-tag";
import { CalculationCardType } from "@/features/tech-card/model/type";
import { dbCardAdmin } from "@/lib/firebase-admin-card";
import { unstable_cache } from "next/cache";

const actionTag = TECH_CARD_ACTION_TAG;

export async function _getCardById(
  id: string,
): Promise<CalculationCardType | null> {
  const snapshot = await dbCardAdmin.collection(actionTag).doc(id).get();

  if (!snapshot.exists) return null;

  return snapshot.data() as CalculationCardType;
}

export const getCardById = unstable_cache(_getCardById, [actionTag], {
  revalidate: false,
  tags: [actionTag],
});
