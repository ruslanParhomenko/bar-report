import {
  DATA_BREAK_ACTION_TAG,
  DATA_MENU_ACTION_TAG,
  DATA_MENU_DAILY_ACTION_TAG,
  DATA_ORDER_PRODUCTS_ACTION_TAG,
  DATA_PRICE_LIST_ACTION_TAG,
  DATA_PRODUCTS_ACTION_TAG,
  DATA_TTN_ACTION_TAG,
} from "@/constants/action-tag";

import { BreakForm } from "@/features/staff/bar/break/model/schema";
import { MenuDailyDataForm } from "@/features/staff/menu/menu-daily/model/type";

import { dbAdmin } from "@/lib/firebase-admin";
import { unstable_cache } from "next/cache";

import {
  DataMenu,
  DataOrderProducts,
  DataPriceList,
  DataProducts,
  DataTTN,
} from "../model/type";

export async function _getDataJson<T>(tag: string): Promise<T | null> {
  const docRef = dbAdmin.collection(tag).doc(tag);
  const snap = await docRef.get();

  if (!snap.exists) return null;

  return snap.data() as T;
}

export function getCachedData<T>(tag: string) {
  return unstable_cache(() => _getDataJson<T>(tag), [tag], {
    revalidate: false,
    tags: [tag],
  });
}

export const getDataProducts = getCachedData<DataProducts>(
  DATA_PRODUCTS_ACTION_TAG,
);

export const getDataBreakList = getCachedData<BreakForm>(DATA_BREAK_ACTION_TAG);

export const getDataOrderProducts = getCachedData<DataOrderProducts>(
  DATA_ORDER_PRODUCTS_ACTION_TAG,
);

export const getDataTTN = getCachedData<DataTTN>(DATA_TTN_ACTION_TAG);

export const getDataPriceList = getCachedData<DataPriceList>(
  DATA_PRICE_LIST_ACTION_TAG,
);

export const getDataMenu = getCachedData<DataMenu>(DATA_MENU_ACTION_TAG);

export const getDataMenuDaily = getCachedData<MenuDailyDataForm>(
  DATA_MENU_DAILY_ACTION_TAG,
);
