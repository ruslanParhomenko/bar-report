import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

const supportedLocales = ["ru", "ro"];

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const localeFromCookie = cookieStore.get("NEXT_LOCALE_BAR")?.value ?? "ru";

  const locale = supportedLocales.includes(localeFromCookie)
    ? localeFromCookie
    : "ru";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
