import { DATA_PRODUCTS_ACTION_TAG } from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache, updateTag } from "next/cache";

//create

export type createDataProducts = {
  ingredients: string[];
  salad: string[];
  soup: string[];
  meat: string[];
  garnish: string[];
  dessert: string[];
  meat_fish: string[];
  semifinished: string[];
  staff: string[];
};

export async function createDataProducts(data: createDataProducts) {
  const docRef = dbAdmin
    .collection(DATA_PRODUCTS_ACTION_TAG)
    .doc(DATA_PRODUCTS_ACTION_TAG);

  await docRef.set(data, { merge: true });

  updateTag(DATA_PRODUCTS_ACTION_TAG);
}
export async function _getDataProducts() {
  const docRef = dbAdmin
    .collection(DATA_PRODUCTS_ACTION_TAG)
    .doc(DATA_PRODUCTS_ACTION_TAG);
  const snap = await docRef.get();

  if (!snap.exists) return null;

  const data = snap.data() as any;

  return data as createDataProducts;
}

export const getDataProducts = unstable_cache(
  _getDataProducts,
  [DATA_PRODUCTS_ACTION_TAG],
  {
    revalidate: false,
    tags: [DATA_PRODUCTS_ACTION_TAG],
  },
);
