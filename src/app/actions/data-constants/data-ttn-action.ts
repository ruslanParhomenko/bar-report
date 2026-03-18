import { DATA_TTN_ACTION_TAG } from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache, updateTag } from "next/cache";

//create

export type createDataTTN = {
  agent: string[];
};

export async function createDataTTN(data: createDataTTN) {
  const docRef = dbAdmin
    .collection(DATA_TTN_ACTION_TAG)
    .doc(DATA_TTN_ACTION_TAG);

  await docRef.set(data);

  updateTag(DATA_TTN_ACTION_TAG);
}
export async function _getDataTTN() {
  const docRef = dbAdmin
    .collection(DATA_TTN_ACTION_TAG)
    .doc(DATA_TTN_ACTION_TAG);
  const snap = await docRef.get();

  if (!snap.exists) return [];

  const data = snap.data() as any;

  return data as createDataTTN;
}

export const getDataTTN = unstable_cache(_getDataTTN, [DATA_TTN_ACTION_TAG], {
  revalidate: false,
  tags: [DATA_TTN_ACTION_TAG],
});
