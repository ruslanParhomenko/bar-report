"use client";
import { useTranslations } from "next-intl";
import { Dot } from "lucide-react";
import { Menu } from "@/app/actions/google/google-action";

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
        <div key={idx} className="w-full flex flex-col items-center">
          <h1 className="flex justify-center items-center font-bold text-[20px] py-5 text-bl">
            <Dot />
            {sec.title}
            <Dot />
          </h1>
          {sec.items && (
            <div className="flex flex-col w-full justify-center items-center gap-4 text-[16px] pt-1">
              <ul
                className={`list-none flex flex-col items-center justify-center ${
                  sec.wHalf ? "w-1/2" : ""
                }`}
              >
                {sec.items.map((el, id) => (
                  <li key={id} className="font-bold pt-4">
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
