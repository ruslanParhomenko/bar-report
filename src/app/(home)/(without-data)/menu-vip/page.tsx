import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Children } from "react";

const MENU_PAGE = [
  {
    href: "/menu-vip/bar",
    title: "bar",
  },
  {
    href: "/menu-vip/cuisine",
    title: "cuisine",
  },
  {
    href: "/menu-vip/daily-menu",
    title: "Daily Menu",
  },
  {
    href: "/menu-vip/staff-menu",
    title: "Staff Menu",
  },
];

export default function Menu() {
  const t = useTranslations("Menu");
  return (
    <div className={" flex flex-col  items-center gap-14  pt-40 "}>
      {MENU_PAGE.map((el, index) => (
        <button key={index}>
          <Link href={el.href}>
            <p className="rounded-full border border-solid border-transparent  flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838]  h-10  w-40">
              {t(el.title)}
            </p>
          </Link>
        </button>
      ))}
    </div>
  );
}
