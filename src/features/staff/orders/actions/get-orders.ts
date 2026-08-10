"use server";
import { ORDERS_ACTION_TAG } from "@/constants/action-tag";

import { getYearMonthDoc } from "@/lib/firebase-doc";
import { unstable_cache } from "next/cache";
import { GetOrdersData } from "../model/type";

const actionTag = ORDERS_ACTION_TAG;

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
