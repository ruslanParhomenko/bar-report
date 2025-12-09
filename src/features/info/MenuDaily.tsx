import { useTranslations } from "next-intl";
import { Dot } from "lucide-react";
import { Menu } from "@/app/actions/google/googleSheetAction";

export function MenuDaily({ data }: { data: Menu }) {
  const dataDaily = data && data.daily;
  const t = useTranslations("Menu");

  if (!dataDaily) return null;
  return (
    <div className="flex flex-col items-center justify-center w-full relative tracking-wider">
      <h1 className="flex justify-center items-center font-bold text-[20px] py-5 ">
        <Dot />
        {t("Saids & Appetizers")}
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
              {id % 2 === 0 && el ? t(el) : el}
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
              {id % 2 === 0 && el ? t(el) : el}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
