"use client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import ButtonNavigationPage from "@/components/meniu/ButtonNavigationPage";
import { useSwipeable } from "react-swipeable";
import { Dot } from "lucide-react";
import { useGoogleData } from "@/hooks/useGoogleData";

export default function DailyMenuForm() {
  const { menu: data, isLoading } = useGoogleData();
  const dataDaily = data && data.daily;
  const t = useTranslations("Meniu");
  const router = useRouter();

  const left = `/meniu-vip/`;
  const right = `/meniu-vip/`;

  const handlers = useSwipeable({
    onSwipedLeft: () => router.push(right),
    onSwipedRight: () => router.push(left),
  });
  if (isLoading) return null;
  return (
    <div
      {...handlers}
      className="flex flex-col items-center justify-center w-full relative tracking-wider"
    >
      <ButtonNavigationPage leftPage="/meniu-vip" rightPage="/meniu-vip" />
      <h1 className="flex justify-center items-center font-bold text-[20px] py-5 ">
        <Dot />
        {t("Salds & Appetixers")}
        <Dot />
      </h1>
      <div className="flex flex-col w-full justify-center items-center gap-4 text-[16px] pt-1 ">
        <ul className="list-none flex flex-col items-center justify-center">
          {dataDaily?.titleSalad?.map((el: any, id: number) => (
            <li key={id} className={id % 2 === 0 ? "font-bold" : ""}>
              {id % 2 === 0 ? t(el) : el}
            </li>
          ))}
        </ul>
      </div>
      <h1 className="flex justify-center items-center font-bold text-[20px] py-5">
        <Dot />
        {t("Second Courses")}
        <Dot />
      </h1>
      <div className="flex flex-col w-full justify-center items-center gap-4 text-[16px] pt-1 ">
        <ul className="list-none  flex flex-col items-center justify-center">
          {dataDaily?.titleSecond?.map((el: any, id: number) => (
            <li key={id} className={id % 2 === 0 ? "font-bold" : ""}>
              {id % 2 === 0 ? t(el) : el}
            </li>
          ))}
        </ul>
      </div>
      <h1 className="flex justify-center items-center font-bold text-[20px] py-5">
        <Dot />
        {t("Soups")}
        <Dot />
      </h1>
      <div className="flex flex-col w-full justify-center items-center gap-4 text-[16px] pt-1 ">
        <ul className="list-none w-1/2 flex flex-col items-center justify-center">
          {dataDaily?.titleMain?.map((el: any, id: number) => (
            <li key={id} className={id % 2 === 0 ? "font-bold" : ""}>
              {id % 2 === 0 ? t(el) : el}
            </li>
          ))}
        </ul>
      </div>
      <h1 className="flex justify-center items-center font-bold text-[20px] py-5">
        <Dot />
        {t("Side Dishes")}
        <Dot />
      </h1>
      <h1 className="flex justify-center items-center font-bold text-[20px] py-5">
        <Dot />
        {t("Desserts")}
        <Dot />
      </h1>
      <div className="flex flex-col w-full justify-center items-center gap-4 text-[16px] pt-1 ">
        <ul className="list-none w-1/2 flex flex-col items-center justify-center">
          {dataDaily?.titleDesserts?.map((el: any, id: number) => (
            <li key={id} className={id % 2 === 0 ? "font-bold" : ""}>
              {id % 2 === 0 ? t(el) : el}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
