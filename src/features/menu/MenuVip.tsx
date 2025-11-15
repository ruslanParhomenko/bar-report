import { Spinner } from "@/components/ui/spinner";
import { useGoogleData } from "@/hooks/useGoogleData";
import { Dot } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export function MenuVip() {
  const { patch } = useParams();
  const { menu: data, isLoading } = useGoogleData();
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

  if (isLoading) return <Spinner />;
  return (
    <div className="w-full grid grid-cols-[0fr_1fr_0fr] md:grid-cols-[1fr_2fr_1fr] md:gap-4">
      <div></div>
      <div>
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
      <div></div>
    </div>
  );
}
