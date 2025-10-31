"use server";

import { TipsFormType } from "@/features/settings/tips/schema";
import { supabase } from "@/lib/supabaseClient";

/**
 * Сохраняет все данные формы TipsFormType в Supabase
 */
export async function saveTipsForm(data: TipsFormType) {
  const { year, month, rowEmployeesTips, cashTips, id } = data;

  // Для каждой строки создаем или обновляем запись
  const employeePromises = rowEmployeesTips.map((row: any) => {
    return supabase
      .from("tips")
      .upsert({
        id: row.id || undefined,
        employee_id: row.employeeId,
        role: row.role,
        rate: row.rate,
        tips: row.tips || null,
        tips_by_day: row.tipsByDay,
        year,
        month,
      })
      .select();
  });

  // Для cash tips
  const cashPromise = supabase
    .from("cash_tips")
    .upsert({
      id: cashTips.employee, // можно использовать employee как id
      tips: cashTips.tips || null,
      tips_by_day: cashTips.tipsByDay,
      year,
      month,
    })
    .select();

  const results = await Promise.all([...employeePromises, cashPromise]);

  return results;
}
