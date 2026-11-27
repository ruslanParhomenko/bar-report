"use server";
import { TECH_CARD_ACTION_TAG } from "@/constants/action-tag";
import { CalculationCardType } from "@/features/tech-card/model/type";
import { dbCardAdmin } from "@/lib/firebase-admin-card";
import { unstable_cache } from "next/cache";

const actionTag = TECH_CARD_ACTION_TAG;

export async function _getAllCards() {
  const snapshot = await dbCardAdmin.collection(actionTag).get();

  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as CalculationCardType,
  );
}

export const getAllCards = unstable_cache(_getAllCards, [actionTag], {
  revalidate: false,
  tags: [actionTag],
});
