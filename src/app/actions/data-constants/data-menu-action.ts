import { DATA_MENU_ACTION_TAG } from "@/constants/action-tag";
import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache, updateTag } from "next/cache";

const actionTag = DATA_MENU_ACTION_TAG;

// TYPES

export type MenuItem = {
  name: string;
  weight: string;
  price: number | null;
  label?: string;
};

// export type MenuSubgroup = {
//   label: string;
//   items: MenuItem[];
// };

// export type MenuSection = {
//   id: string;
//   title: string;
//   items?: MenuItem[];
//   subgroups?: MenuSubgroup[];
// };

// export type MenuColumn = {
//   id: string;
//   title?: string;

//   sections?: MenuSection[];

//   twoColumnLayout?: boolean;
//   columnLeft?: MenuSection[];
//   columnRight?: MenuSection[];

//   type?: "cover";
//   qrUrl?: string;

//   note?: string;
// };

// export type MenuPage = {
//   name: string;
//   price: number;
//   weight: string;
//   label?: string;
// };

export type MenuDataType = Record<string, MenuItem[]>;

// CREATE

export async function createDataMenu(data: MenuDataType) {
  const docRef = dbAdmin.collection(actionTag).doc(actionTag);

  await docRef.set(data);

  updateTag(actionTag);
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
