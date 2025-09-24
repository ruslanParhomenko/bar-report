"use client";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ButtonNavigationPage from "@/components/meniu/ButtonNavigationPage";
import { useSwipeable } from "react-swipeable";
import { Dot } from "lucide-react";
import { useGoogleData } from "@/hooks/useGoogleData";

export function RenderItemMeniu({ item, leftPage, rightPage }: any) {
  const { menu: data, isLoading } = useGoogleData();
  const t = useTranslations("Meniu");
  const left = `/${leftPage}`;
  const right = `/${rightPage}`;

  const router = useRouter();
  const handlers = useSwipeable({
    onSwipedLeft: () => router.push(right),
    onSwipedRight: () => router.push(left),
  });

  const selectArr = {
    bar: 0,
    bar1: 1,
    cusine: 2,
  } as const;

  const itemSelect = selectArr[item as keyof typeof selectArr] as number;
  const arrData = data?.vip[itemSelect];
  if (isLoading) return null;
  return (
    <div {...handlers} className="w-full md:px-4 pb-4 relative">
      <ButtonNavigationPage leftPage={left} rightPage={right} />
      {arrData?.map((el: any, index: number) => (
        <div key={index}>
          <h1 className="flex justify-center items-center font-bold text-[18px] py-5">
            <Dot />
            {t(el.title)}
            <Dot />
          </h1>
          <div className="flex  gap-4 text-[14px] pt-1 ">
            <ul className="list-none w-1/2">
              {el.listItem?.map((el: any, id: number) => (
                <li key={id}>{item === "cusine" ? t(el) : el}</li>
              ))}
            </ul>
            <ul className="flex-1 list-none">
              {el.listGramm?.map((el: any, id: number) => (
                <li key={id} className="text-center">
                  {el}
                </li>
              ))}
            </ul>
            <ul className="list-none w-1/4 text-right ">
              {el.listPrice?.map((el: any, id: number) => (
                <li key={id}>
                  {el}&nbsp;&nbsp;{t("lei")}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
      <ButtonNavigationPage leftPage={left} rightPage={right} />
    </div>
  );
}
