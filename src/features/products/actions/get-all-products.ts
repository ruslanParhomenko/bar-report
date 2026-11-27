"use server";

import { PRODUCTS_ACTION_TAG } from "@/constants/action-tag";
import { ProductType } from "@/features/products/model/type";
import { dbCardAdmin } from "@/lib/firebase-admin-card";
import { unstable_cache } from "next/cache";

const actionTag = PRODUCTS_ACTION_TAG;

export async function _getAllProducts() {
  const snapshot = await dbCardAdmin.collection(actionTag).get();
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as ProductType,
  );
}

export const getAllProducts = unstable_cache(_getAllProducts, [actionTag], {
  revalidate: false,
  tags: [actionTag],
});
