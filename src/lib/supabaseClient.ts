import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jhnwncaewmudmlnromlg.supabase.co";

// const supabaseUrlStaff = "https://oftgvsegsqmfurcflqta.supabase.co";

export const supabase = createClient(
  supabaseUrl,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// export const supabaseStaff = createClient(
//   supabaseUrlStaff,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_STAFF_KEY!
// );
