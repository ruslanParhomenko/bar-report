"use server";

import { TipsFormType } from "@/features/settings/tips/schema";
import { supabase } from "@/lib/supabaseClient";

export async function getTipsForm(year: string, month: string) {
  // Получаем сотрудников
  const { data: rows, error: rowsError } = await supabase
    .from("tips")
    .select("*")
    .eq("year", year)
    .eq("month", month);

  if (rowsError) throw rowsError;

  // Получаем cash tips
  const { data: cashData, error: cashError } = await supabase
    .from("cash_tips")
    .select("*")
    .eq("year", year)
    .eq("month", month)
    .single();

  if (cashError && cashError.code !== "PGRST116") throw cashError; // ignore not found

  return {
    rowEmployeesTips: rows || [],
    cashTips: cashData || { tipsByDay: [], tips: "", employee: "cash" },
  };
}
