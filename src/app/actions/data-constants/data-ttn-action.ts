import { DATA_TTN_ACTION_TAG } from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache, updateTag } from "next/cache";

//create

export type CreateDataTTN = {
  agent: string[];
};

export async function createDataTTN(data: CreateDataTTN) {
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

  if (!snap.exists) return { agent: [] };

  const data = snap.data() as any;

  return data as CreateDataTTN;
}

export const getDataTTN = unstable_cache(_getDataTTN, [DATA_TTN_ACTION_TAG], {
  revalidate: false,
  tags: [DATA_TTN_ACTION_TAG],
});
