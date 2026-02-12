import { Menu } from "@/app/actions/google/googleSheetAction";
import { Dot } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";

export function MenuVip({ data }: { data: Menu | null }) {
  const t = useTranslations("Menu");
  const menuData = data?.vip;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8 gap-2 px-1">
      {menuData?.map((column: any[], colIndex: number) => (
        <Card key={colIndex} className="px-4">
          <CardContent className="md:px-10">
            {column.map((section: any, secIndex: number) => (
              <div key={secIndex}>
                <h1 className="flex justify-center items-center font-bold  py-2">
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
