"use client";
import { Menu } from "@/app/actions/google/google-action";
import { Dot } from "lucide-react";
import { useTranslations } from "next-intl";

export function MenuDaily({ data }: { data: Menu | null }) {
  const t = useTranslations("Menu");
  const dataDaily = data?.daily;
  if (!dataDaily) return null;

  const sections: { title: string; items?: string[]; wHalf?: boolean }[] = [
    { title: t("Saids & Appetizers"), items: dataDaily.titleSalad },
    { title: t("Second Courses"), items: dataDaily.titleSecond },
    { title: t("Soups"), items: dataDaily.titleSoup, wHalf: true },
    { title: t("Side Dishes"), items: dataDaily.titleGarner, wHalf: true },
    { title: t("Desserts"), items: dataDaily.titleDesserts, wHalf: true },
  ];

  return (
    <div className="flex flex-col items-center justify-center tracking-wider">
      {sections.map((sec, idx) => (
        <div key={idx} className="flex w-full flex-col items-center">
          <h1 className="text-bl flex items-center justify-center py-5 text-[20px] font-bold">
            <Dot />
            {sec.title}
            <Dot />
          </h1>
          {sec.items && (
            <div className="flex w-full flex-col items-center justify-center gap-4 pt-1 text-[16px]">
              <ul
                className={`flex list-none flex-col items-center justify-center ${
                  sec.wHalf ? "w-1/2" : ""
                }`}
              >
                {sec.items.map((el, id) => (
                  <li key={id} className="pt-4 font-bold">
                    {el}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
