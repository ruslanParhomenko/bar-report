import { defineRouting } from "next-intl/routing";
export const routing = defineRouting({
  locales: ["ro", "ru"],
  defaultLocale: "ru",
  localePrefix: "never",
});
