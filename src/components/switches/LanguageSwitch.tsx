"use client";
import { useLocale, useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "@/i18n/navigation";
import { Globe } from "phosphor-react";

export const LANGUAGES_LIST = [
  { label: "romanian", lang: "ro" },
  { label: "russian", lang: "ru" },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const t = useTranslations("Home");

  const changeLanguage = (lang: string) => {
    document.cookie = `NEXT_LOCALE_BAR=${lang}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT;`;
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full focus:outline-none">
          <Globe className="text-bl size-6 transition duration-300 ease-in-out hover:scale-110 hover:text-bl" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-32 rounded-md bg-white shadow-md dark:bg-gray-800"
      >
        {LANGUAGES_LIST.filter(({ lang }) => lang !== locale).map(
          ({ label, lang }) => (
            <DropdownMenuItem
              key={lang}
              onSelect={() => changeLanguage(lang)}
              className="cursor-pointer px-2 py-2 text-sm hover:bg-[#175CD340] hover:text-white focus:bg-[#347AE2] focus:text-white"
            >
              {t(label)}
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
