import { supabase } from "./supabaseClient";

export async function fetchRealTime(table: string, select: string = "*") {
  const { data, error } = await supabase.from(table).select(select);

  if (error) throw new Error(error.message);
  return data;
}
