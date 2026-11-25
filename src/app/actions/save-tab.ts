"use server";

import { cookies } from "next/headers";

export async function saveTab(pathname: string, tab: string) {
  const store = await cookies();
  store.set(`nav-tab-${pathname}`, tab, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: "lax",
  });
}
