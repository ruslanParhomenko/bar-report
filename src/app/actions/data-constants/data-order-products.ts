import { DATA_ORDER_PRODUCTS_ACTION_TAG } from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache, updateTag } from "next/cache";

//create

export type createDataOrderProducts = {
  bar: Record<string, string[]>;
  cucina: Record<string, string[]>;
  ttnBar: Record<string, string[]>;
  ttnCucina: Record<string, string[]>;
};

export async function createDataOrderProducts(data: createDataOrderProducts) {
  const docRef = dbAdmin
    .collection(DATA_ORDER_PRODUCTS_ACTION_TAG)
    .doc(DATA_ORDER_PRODUCTS_ACTION_TAG);

  await docRef.set(data, { merge: true });

  updateTag(DATA_ORDER_PRODUCTS_ACTION_TAG);
}
export async function _getDataOrderProducts() {
  const docRef = dbAdmin
    .collection(DATA_ORDER_PRODUCTS_ACTION_TAG)
    .doc(DATA_ORDER_PRODUCTS_ACTION_TAG);
  const snap = await docRef.get();

  if (!snap.exists) return [];

  const data = snap.data() as any;

  return data as createDataOrderProducts;
}

export const getDataOrderProducts = unstable_cache(
  _getDataOrderProducts,
  [DATA_ORDER_PRODUCTS_ACTION_TAG],
  {
    revalidate: false,
    tags: [DATA_ORDER_PRODUCTS_ACTION_TAG],
  },
);
