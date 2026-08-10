"use server";
import { ORDERS_ACTION_TAG } from "@/constants/action-tag";

import { getYearMonthDoc } from "@/lib/firebase-doc";
import { updateTag } from "next/cache";
import { OrdersDataForm } from "../model/type";

const actionTag = ORDERS_ACTION_TAG;

export async function createOrder(data: OrdersDataForm) {
  const { year, month, day, orders, tab } = data;

  const tag = `${actionTag}-${tab}`;
  const docRef = getYearMonthDoc(tag, year, month);
  const docRefByDay = docRef.collection("days").doc(day);

  await docRefByDay.set({ orders });

  updateTag(tag);
  return docRefByDay.id;
}
