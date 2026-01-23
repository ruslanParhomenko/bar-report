"use server";

import { CashFormTypeInput } from "@/features/cash/schema";
import { supabase } from "@/lib/supabase-client";
import { unstable_cache } from "next/cache";
import { updateTag } from "next/cache";
import { CASH_ACTION_TAG } from "@/constants/action-tag";

// type
export type CashData = {
  id: string;
  unique_id: string;
  form_data: CashFormTypeInput;
};
// save
export async function saveCashForm(data: CashFormTypeInput) {
  const { year, month } = data;

  if (!year || !month) {
    throw new Error("Year или month отсутствуют в данных формы");
  }

  const unique_id = `${year}-${month}`;

  const { data: savedData, error } = await supabase
    .from(CASH_ACTION_TAG)
    .upsert(
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
      { onConflict: "unique_id" },
    );

  if (error) {
    console.error("Ошибка при сохранении формы:", error);
    throw error;
  }
  updateTag(CASH_ACTION_TAG);

  return savedData;
}

// get by unique_id
export async function _getCashFormById(unique_id: string) {
  const { data, error } = await supabase
    .from(CASH_ACTION_TAG)
    .select("*")
    .eq("unique_id", unique_id)
    .maybeSingle();

  if (error) {
    console.error("Ошибка при получении данных формы:", error);
    throw error;
  }

  return data ?? null;
}

export const getCashFormById = unstable_cache(
  _getCashFormById,
  [CASH_ACTION_TAG],
  {
    revalidate: false,
    tags: [CASH_ACTION_TAG],
  },
);
