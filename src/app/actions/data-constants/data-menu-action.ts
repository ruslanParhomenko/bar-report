import { DATA_MENU_ACTION_TAG } from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache, updateTag } from "next/cache";
import { invalidateEverywhere } from "../invalidateEverywhere/invalidate-everywhere";

const actionTag = DATA_MENU_ACTION_TAG;

// TYPES

export type MenuItem = {
  name: string;
  weight: string;
  price: number | null;
  label?: string;
};

export type MenuDataType = Record<string, MenuItem[]>;

// CREATE

export async function createDataMenu(data: MenuDataType) {
  const docRef = dbAdmin.collection(actionTag).doc(actionTag);

  await docRef.set(data);

  updateTag(actionTag);
  await invalidateEverywhere(actionTag);
}

// GET

export async function _getDataMenu() {
  const docRef = dbAdmin.collection(actionTag).doc(actionTag);

  const snap = await docRef.get();

  if (!snap.exists) return null;

  return snap.data() as MenuDataType;
}

export const getDataMenu = unstable_cache(_getDataMenu, [actionTag], {
  revalidate: false,
  tags: [actionTag],
});
