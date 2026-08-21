"use client";

import { cn } from "@/lib/utils";
import { MONTHS } from "@/utils/get-month-days";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface LinkNavProps {
  title: string;
  query?: {
    tabs?: readonly string[];
    selectDate?: boolean;
  };
  children?: ReactNode;
}

export default function LinkNav({ title, query, children }: LinkNavProps) {
  const t = useTranslations("Sidebar");
  const pathname = usePathname();
  const params = new URLSearchParams();

  const date = new Date();
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear().toString();

  const isActivePath = pathname.split("/")[1] === title;

  const queryTabs = query?.tabs?.[0];
  const queryDate = query?.selectDate;

  if (queryTabs) {
    params.set("tab", queryTabs);
  }

  if (queryDate) {
    params.set("month", month);
    params.set("year", year);
  }

  const queryString = params.toString();
  const href = queryString ? `/${title}?${queryString}` : `/${title}`;

  return (
    <Link
      href={href}
      className={cn(
        "hover:[&>span]:text-rd hover:[&>svg]:text-rd flex h-9 w-full cursor-default items-center gap-2 rounded-md py-2 pl-4 hover:bg-white md:h-10",
        isActivePath && "text-rd [&>span]:text-rd [&>svg]:text-rd bg-white",
      )}
    >
      {children}
      <span className="text-bl ml-1">{t(title)}</span>
    </Link>
  );
}
