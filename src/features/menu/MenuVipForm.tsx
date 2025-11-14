"use client";
import { useTranslations } from "next-intl";
import { Dot } from "lucide-react";
import { useGoogleData } from "@/hooks/useGoogleData";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export function RenderItemMenu() {
  const { patch } = useParams();
  const { menu: data, isLoading } = useGoogleData();

  console.log("data vip", data);
  const t = useTranslations("Menu");

  const menuData = useMemo(() => {
    if (!data?.vip) return [];

    if (patch === "bar") {
      return [...(data.vip[0] || []), ...(data.vip[1] || [])];
    } else if (patch === "cuisine") {
      return [...(data.vip[2] || [])];
    }

    return [];
  }, [patch, data]);

  if (isLoading) return null;
  return (
    <div className="w-full md:mx-0 pb-4 md:px-150">
      {menuData?.map((el: any, index: number) => (
        <div key={index}>
          <h1 className="flex justify-center items-center font-bold text-[18px] py-5">
            <Dot />
            {t(el.title)}
            <Dot />
          </h1>
          <div className="flex  gap-4 text-[14px] pt-1 ">
            <ul className="list-none w-1/2">
              {el.listItem?.map((el: any, id: number) => (
                <li key={id}>{patch === "cuisine" ? t(el) : el}</li>
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
    </div>
  );
}
