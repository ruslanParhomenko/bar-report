import { Menu } from "@/app/actions/google/google-action";
import { Dot } from "lucide-react";
import { useTranslations } from "next-intl";

export function MenuVip({ data }: { data: Menu | null }) {
  const t = useTranslations("Menu");
  const menuData = data?.vip;

  return (
    <div className="grid grid-cols-1 gap-2 px-2 md:grid-cols-3 md:gap-6">
      {menuData?.map((column: any[], colIndex: number) => (
        <div
          key={colIndex}
          className="border-bl bg-transparent px-4 py-0 md:border-x"
        >
          {column.map((section: any, secIndex: number) => (
            <div key={secIndex}>
              <h1 className="text-bl flex items-center justify-center py-0.5 font-bold">
                <Dot />
                {t(section.title)}
                <Dot />
              </h1>
              <div className="flex gap-4 text-xs">
                <ul className="w-1/2 list-none">
                  {section.listItem?.map((item: string, id: number) => (
                    <li key={id}>{item}</li>
                  ))}
                </ul>
                <ul className="flex-1 list-none text-center">
                  {section.listGramm?.map((gr: string, id: number) => (
                    <li key={id}>{gr}</li>
                  ))}
                </ul>
                <ul className="w-1/4 list-none text-right">
                  {section.listPrice?.map((price: number, id: number) => (
                    <li key={id}>
                      {price}&nbsp;{t("lei")}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
