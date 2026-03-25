"use server";
import { unstable_cache } from "next/cache";
import { updateTag } from "next/cache";
import { FIN_CASH_ACTION_TAG } from "@/constants/action-tag";
import { supabaseServer } from "@/lib/supabase-server";
import { FinCashForm } from "@/features/fin-cash/schema";

// type
export type GetFinCashRowByYear = {
  id: string;
  unique_id: string;
  form_data: FinCashForm;
};

export type SaveFinCashForm = {
  year: string;
  form_data: FinCashForm;
};

const supabase = supabaseServer();
const TAG = FIN_CASH_ACTION_TAG;
// save
export async function saveFinCashForm(data: SaveFinCashForm) {
  const { year, form_data: formData } = data;

  if (!year) {
    throw new Error("Year отсутствует в данных формы");
  }

  const { data: savedData, error } = await supabase.from(TAG).upsert(
    {
      unique_id: year,
      form_data: formData,
    },
    { onConflict: "unique_id" },
  );

  if (error) {
    console.error("Ошибка при сохранении формы:", error);
    throw error;
  }
  updateTag(TAG);

  return savedData;
}

// get by unique_id
export async function _getFinCashRowByYear(year: string) {
  const { data } = await supabase
    .from(TAG)
    .select("*")
    .eq("unique_id", year)
    .maybeSingle();

  return data ?? null;
}

export const getFinCashRowByYear = unstable_cache(_getFinCashRowByYear, [TAG], {
  revalidate: false,
  tags: [TAG],
});
