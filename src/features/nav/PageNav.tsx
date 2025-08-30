"use client";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/navigation";

export type PageNavType = {
  title: string;
  href: string;
};

function PageNav({
  navItems,
  mainRoute,
}: {
  navItems: PageNavType[];
  mainRoute: string;
}) {
  const pathname = usePathname();

  const t = useTranslations("Home");

  const basePath = mainRoute ? `/${mainRoute}/` : "/";
  const selectedPath =
    pathname.replace(basePath, "").split("/")[0] || undefined;

  const isActive = (href: string) => {
    return href === "" ? selectedPath === undefined : selectedPath === href;
  };

  return (
    <div className="pb-4 pt-2 px-2 sticky top-0 z-10 bg-white">
      <div className="flex flex-row justify-end md:justify-start gap-6 border-b border-gray-200  ">
        {navItems
          .filter((page) => page.href !== "#")
          .map((page) => {
            return (
              <Link
                key={page.title}
                href={`/${mainRoute}/${page.href}`}
                className={cn(
                  "text-nowrap hover:text-blue-600",
                  isActive(page.href)
                    ? "border-b-[3px] border-blue-500 pb-4 font-bold text-blue-600"
                    : ""
                )}
              >
                {t(page.title)}
              </Link>
            );
          })}
      </div>
    </div>
  );
}
export default PageNav;
