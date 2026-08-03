"use server";
import { ORDERS_ACTION_TAG } from "@/constants/action-tag";

import { getYearMonthDoc } from "@/lib/firebase-doc";
import { unstable_cache, updateTag } from "next/cache";

const actionTag = ORDERS_ACTION_TAG;

type OrdersDataForm = {
  tab: string;
  year: string;
  month: string;
  day: string;
  orders: Record<string, Record<string, string>>;
};

export type GetOrdersData = {
  id: string;
  orders: Record<string, Record<string, string>>;
};
// create
export async function createOrders(data: OrdersDataForm) {
  const { year, month, day, orders, tab } = data;

  const tag = `${actionTag}-${tab}`;
  const docRef = getYearMonthDoc(tag, year, month);
  const docRefByDay = docRef.collection("days").doc(day);

  await docRefByDay.set({ orders });

  updateTag(tag);
  return docRefByDay.id;
}

// get by month year
async function _getOrdersByYearMonth(
  tab: string,
  year: string,
  month: string,
): Promise<GetOrdersData[] | null> {
  const tag = `${actionTag}-${tab}`;
  const docRef = getYearMonthDoc(tag, year, month);
  const daysSnap = await docRef.collection("days").get();

  if (daysSnap.empty) return null;

  const orders = daysSnap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as { orders: Record<string, Record<string, string>> }),
  }));

  return orders;
}

const getOrdersCached = (tab: string) =>
  unstable_cache(
    (year: string, month: string) => _getOrdersByYearMonth(tab, year, month),
    [actionTag, tab],
    {
      tags: [`${actionTag}-${tab}`],
      revalidate: false,
    },
  );

export async function getOrdersByYearMonth(
  tab: string,
  year: string,
  month: string,
) {
  return getOrdersCached(tab)(year, month);
}
