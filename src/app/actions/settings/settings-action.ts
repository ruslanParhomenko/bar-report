"use server";

import { createDataBreakList } from "../data-constants/data-break-action";
import { createDataOrderProducts } from "../data-constants/data-order-products";
import { createDataProducts } from "../data-constants/data-products-action";

type State = {
  success?: boolean;
  error?: string;
};

export async function saveSettingsData(
  _: State,
  formData: FormData,
): Promise<State> {
  const raw = formData.get("json") ?? formData.get("1_json");

  const type = (formData.get("type") ?? formData.get("1_type"))?.toString();

  if (!raw || typeof raw !== "string") {
    return { error: "JSON is required" };
  }

  if (!type) {
    return { error: "Type is required" };
  }

  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return { error: "Invalid JSON format" };
  }

  try {
    if (type === "products") {
      if (typeof parsed !== "object" || Array.isArray(parsed)) {
        return { error: "Products JSON must be an object" };
      }

      await createDataProducts(parsed);
    }

    if (type === "breakList") {
      if (!Array.isArray(parsed)) {
        return { error: "BreakList must be an array" };
      }

      await createDataBreakList({
        rows: parsed,
      });
    }
    if (type === "orderProducts") {
      await createDataOrderProducts(parsed);
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Save failed" };
  }
}
