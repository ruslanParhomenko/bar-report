import { DATA_BUFFET_ACTION_TAG } from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache, updateTag } from "next/cache";

const actionTag = DATA_BUFFET_ACTION_TAG;

// TYPES

export type BuffetItem = {
  name: string;
  weight: "kg" | "portion" | null;
  value: number | null;
};

export type BuffetData = {
  id: string;
  product: BuffetItem[];
};

export type GetBuffetData = {
  data: BuffetData[];
};

// CREATE

export async function createDataBuffet(data: GetBuffetData) {
  const docRef = dbAdmin.collection(actionTag).doc(actionTag);

  await docRef.set(data);

  updateTag(actionTag);
}

// GET

export async function _getDataBuffet() {
  const docRef = dbAdmin.collection(actionTag).doc(actionTag);

  const snap = await docRef.get();

  if (!snap.exists) return null;

  return snap.data() as GetBuffetData;
}

export const getDataBuffet = unstable_cache(_getDataBuffet, [actionTag], {
  revalidate: false,
  tags: [actionTag],
});
