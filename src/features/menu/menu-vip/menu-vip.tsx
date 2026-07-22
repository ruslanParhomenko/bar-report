"use client";

import {
  MenuDataType,
  MenuItem,
} from "@/app/actions/data-constants/data-menu-action";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LOCAL_TRANSLATIONS, PAGE_1, PAGE_2, PAGE_3 } from "./constants";
import { SinglePage } from "./menu-page";
import { LocalTranslateFn, MenuSection, PageStructure } from "./types";

export default function MenuVip({ data }: { data: MenuDataType | null }) {
  console.log("data", data);

  const [currentLang, setCurrentLang] = useState<string>("ru");

  const globalT = useTranslations("Menu");

  if (!data) return null;

  const buildSections = (keys: readonly string[]): MenuSection[] => {
    return keys
      .filter((key) => data[key] && data[key].length > 0)
      .map((key) => {
        const items = data[key];
        const hasLabels = items.some((item) => !!item.label);

        if (hasLabels) {
          const subgroupsMap: Record<string, MenuItem[]> = {};
          const directItems: MenuItem[] = [];

          items.forEach((item) => {
            if (item.label) {
              if (!subgroupsMap[item.label]) {
                subgroupsMap[item.label] = [];
              }
              subgroupsMap[item.label].push(item);
            } else {
              directItems.push(item);
            }
          });

          return {
            id: key,
            title: key,
            items: directItems.length > 0 ? directItems : undefined,
            subgroups: Object.entries(subgroupsMap).map(([label, sgItems]) => ({
              label,
              items: sgItems,
            })),
          };
        }

        return {
          id: key,
          title: key,
          items,
        };
      });
  };

  // Постраничная сборка (Страница 1 = Col 1 + Col 2; Страница 2 = Col 3 + Cover)
  const pages: PageStructure[] = [
    {
      id: "page-1",
      columns: [
        {
          id: "col-1",
          sections: buildSections(PAGE_1),
        },
        {
          id: "col-2",
          sections: buildSections(PAGE_2),
        },
      ],
    },
    {
      id: "page-2",
      columns: [
        {
          id: "col-3",
          sections: buildSections(PAGE_3),
        },
        {
          id: "col-4",
          type: "cover",
          title: "menu_title",
          qrUrl: "https://example.com/qr.png",
        },
      ],
    },
  ];

  const localT: LocalTranslateFn = (key: string) => {
    if (LOCAL_TRANSLATIONS[currentLang]?.[key]) {
      return LOCAL_TRANSLATIONS[currentLang][key];
    }
    try {
      return globalT(key);
    } catch {
      return key;
    }
  };

  const isRtl = currentLang === "he";

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap"
      />

      <div className="no-print flex justify-center gap-4 pb-1">
        {["ru", "en", "he", "tr"].map((lang) => (
          <button
            key={lang}
            onClick={() => setCurrentLang(lang)}
            className={`cursor-pointer rounded text-xs uppercase transition-all ${
              currentLang === lang ? "text-rd font-bold" : "text-bl"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      <div
        className="flex h-[87dvh] max-w-[90dvw]"
        style={{
          fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
        }}
      >
        {pages.map((page, i) => (
          <div key={page.id} className="flex w-1/2 flex-col">
            <SinglePage
              page={page}
              label={i === 0 ? "Page 1" : "Page 2"}
              t={localT}
              isRtl={isRtl}
            />
          </div>
        ))}
      </div>
    </>
  );
}
