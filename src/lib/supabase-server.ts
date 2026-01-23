import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jhnwncaewmudmlnromlg.supabase.co";

export function supabaseServer() {
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
}
