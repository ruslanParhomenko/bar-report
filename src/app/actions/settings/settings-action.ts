"use server";

import { createDataBreakList } from "../data-constants/data-break-action";
import { createDataOrderProducts } from "../data-constants/data-order-products";
import { createDataPriceList } from "../data-constants/data-price-list";
import { createDataProducts } from "../data-constants/data-products-action";
import { createDataTTN } from "../data-constants/data-ttn-action";

type State = {
  success?: boolean;
  error?: string;
};

export async function saveSettingsData(
  _: State,
  formData: FormData,
): Promise<State> {
  const raw = formData.get("json");
  const type = formData.get("type")?.toString();

  if (typeof raw !== "string") {
    return { error: "JSON is required" };
  }

  if (!type) {
    return { error: "Type is required" };
  }

  let parsed: any;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return { error: "Invalid JSON format" };
  }

  try {
    switch (type) {
      case "products": {
        if (typeof parsed !== "object" || Array.isArray(parsed)) {
          return { error: "Products JSON must be an object" };
        }
        await createDataProducts(parsed);
        break;
      }

      case "breakList": {
        if (!Array.isArray(parsed)) {
          return { error: "BreakList must be an array" };
        }
        await createDataBreakList({ rows: parsed });
        break;
      }

      case "orderProducts": {
        await createDataOrderProducts(parsed);
        break;
      }

      case "ttn": {
        await createDataTTN(parsed);
        break;
      }

      case "priceList": {
        await createDataPriceList(parsed);
        break;
      }

      default:
        return { error: "Unknown type" };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Save failed" };
  }
}
