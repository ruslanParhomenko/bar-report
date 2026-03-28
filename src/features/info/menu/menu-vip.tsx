import { Menu } from "@/app/actions/google/google-action";
import { Dot } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";

export function MenuVip({ data }: { data: Menu | null }) {
  const t = useTranslations("Menu");
  const menuData = data?.vip;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6 gap-2 px-2 pt-4">
      {menuData?.map((column: any[], colIndex: number) => (
        <div
          key={colIndex}
          className="px-4 bg-transparent py-0 md:border-x border-bl"
        >
          {column.map((section: any, secIndex: number) => (
            <div key={secIndex}>
              <h1 className="flex justify-center items-center font-bold py-1 text-bl">
                <Dot />
                {t(section.title)}
                <Dot />
              </h1>
              <div className="flex gap-4 text-xs">
                <ul className="list-none w-1/2">
                  {section.listItem?.map((item: string, id: number) => (
                    <li key={id}>{item}</li>
                  ))}
                </ul>
                <ul className="flex-1 list-none text-center">
                  {section.listGramm?.map((gr: string, id: number) => (
                    <li key={id}>{gr}</li>
                  ))}
                </ul>
                <ul className="list-none w-1/4 text-right">
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
