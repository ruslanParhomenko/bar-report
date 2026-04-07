"use server";

import { CashForm } from "@/features/cash/schema";
import { unstable_cache } from "next/cache";
import { updateTag } from "next/cache";
import { CASH_ACTION_TAG } from "@/constants/action-tag";
import { supabaseServer } from "@/lib/supabase-server";

// type
export type CashData = {
  id: string;
  unique_id: string;
  form_data: CashForm;
};

const supabase = supabaseServer();
// save
// export async function saveCashForm(
//   data: CashForm,
//   year?: string,
//   month?: string,
// ) {
//   if (!year || !month) {
//     throw new Error("Year или month отсутствуют в данных формы");
//   }

//   const unique_id = `${year}-${month}`;

//   const { data: savedData, error } = await supabase
//     .from(CASH_ACTION_TAG)
//     .upsert(
//       {
//         unique_id: unique_id,
//         form_data: {
//           year: year,
//           month: month,
//           rowCashData: data.rowCashData,
//           start_241: data.start_241,
//           ao_532: data.ao_532,
//           z_531: data.z_531,
//         },
//       },
//       { onConflict: "unique_id" },
//     );

//   if (error) {
//     console.error("Ошибка при сохранении формы:", error);
//     throw error;
//   }
//   updateTag(CASH_ACTION_TAG);

//   return savedData;
// }

export async function saveCashForm(
  data: CashForm,
  year?: string,
  month?: string,
) {
  if (!year || !month) {
    throw new Error("Year and month are missing in the form data");
  }

  const unique_id = `${year}-${month}`;

  // const { data: existingData } = await supabase
  //   .from(CASH_ACTION_TAG)
  //   .select("form_data")
  //   .eq("unique_id", unique_id)
  //   .single();

  // const oldFormData = existingData?.form_data || {};

  // const form_data = {
  //   year,
  //   month,
  //   rowCashData: {
  //     ...oldFormData.rowCashData,
  //     ...data.rowCashData,
  //     tipsByDay: isCash
  //       ? data.rowCashData.tipsByDay
  //       : oldFormData.rowCashData?.tipsByDay,
  //     chipsByDay: isCash
  //       ? data.rowCashData.chipsByDay
  //       : oldFormData.rowCashData?.chipsByDay,
  //     visaCasinoByDay: isCash
  //       ? data.rowCashData.visaCasinoByDay
  //       : oldFormData.rowCashData?.visaCasinoByDay,
  //   },
  //   start_241: isAdmin ? data.start_241 : oldFormData.start_241,
  //   ao_532: isAdmin ? data.ao_532 : oldFormData.ao_532,
  //   z_531: isAdmin ? data.z_531 : oldFormData.z_531,
  // };

  const { data: savedData, error } = await supabase
    .from(CASH_ACTION_TAG)
    .upsert(
      {
        unique_id,
        data,
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
