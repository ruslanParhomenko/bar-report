"use server";

import { CashFormType } from "@/features/cash/schema";
import { supabase } from "@/lib/supabaseClient";
import { unstable_cache } from "next/cache";
import { invalidateEverywhere } from "../invalidateEverywhere/invalidateEverywhere";
import { updateTag } from "next/cache";

// type
export type CashData = {
  id: string;
  unique_id: string;
  form_data: CashFormType;
};
// save
export async function saveCashForm(data: CashFormType) {
  const { year, month } = data;

  if (!year || !month) {
    throw new Error("Year или month отсутствуют в данных формы");
  }

  const unique_id = `${year}-${month}`;

  const { data: savedData, error } = await supabase.from("cash").upsert(
    {
      unique_id: unique_id,
      form_data: {
        year: year,
        month: month,
        rowCashData: data.rowCashData,
        start_241: data.start_241,
        ao_532: data.ao_532,
        z_531: data.z_531,
      },
    },
    { onConflict: "unique_id" }
  );

  if (error) {
    console.error("Ошибка при сохранении формы:", error);
    throw error;
  }
  updateTag("cash");
  await invalidateEverywhere("cash");

  return savedData;
}

// get by unique_id
export async function _getCashFormById(unique_id: string) {
  const { data, error } = await supabase
    .from("cash")
    .select("*")
    .eq("unique_id", unique_id)
    .maybeSingle();

  if (error) {
    console.error("Ошибка при получении данных формы:", error);
    throw error;
  }

  return data ?? null;
}

export const getCashFormById = unstable_cache(_getCashFormById, ["cash"], {
  revalidate: false,
  tags: ["cash"],
});
