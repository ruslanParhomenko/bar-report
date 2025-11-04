"use server";

import { CashFormType } from "@/features/cash/schema";
import { supabase } from "@/lib/supabaseClient";
import { revalidateTag, unstable_cache } from "next/cache";

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
      form_data: data,
    },
    { onConflict: "unique_id" }
  );

  if (error) {
    console.error("Ошибка при сохранении формы:", error);
    throw error;
  }

  await revalidateTag("cash");

  return savedData;
}
// get
export async function _getCashForm() {
  const { data, error } = await supabase
    .from("cash")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Ошибка при получении данных формы:", error);
    throw error;
  }

  return data;
}

export const getCashForm = unstable_cache(_getCashForm, ["cash"], {
  revalidate: false,
  tags: ["cash"],
});
