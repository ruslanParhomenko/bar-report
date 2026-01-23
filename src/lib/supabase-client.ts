import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://jhnwncaewmudmlnromlg.supabase.co";
export const supabase = createClient(
  supabaseUrl,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
