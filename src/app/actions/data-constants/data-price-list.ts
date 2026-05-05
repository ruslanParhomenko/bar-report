import { DATA_PRICE_LIST_ACTION_TAG } from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache, updateTag } from "next/cache";

//create

export type PriceListType = {
  currency: number;
  priceList: Record<
    string,
    { name: string; "price-chips": number; cost: number }[]
  >;
};

export async function createDataPriceList(data: PriceListType) {
  const docRef = dbAdmin
    .collection(DATA_PRICE_LIST_ACTION_TAG)
    .doc(DATA_PRICE_LIST_ACTION_TAG);

  await docRef.set(data);

  updateTag(DATA_PRICE_LIST_ACTION_TAG);
}
export async function _getDataPriceList() {
  const docRef = dbAdmin
    .collection(DATA_PRICE_LIST_ACTION_TAG)
    .doc(DATA_PRICE_LIST_ACTION_TAG);
  const snap = await docRef.get();

  if (!snap.exists) return null;

  const data = snap.data() as any;

  return data as PriceListType;
}

export const getDataPriceList = unstable_cache(
  _getDataPriceList,
  [DATA_PRICE_LIST_ACTION_TAG],
  {
    revalidate: false,
    tags: [DATA_PRICE_LIST_ACTION_TAG],
  },
);
