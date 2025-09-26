"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ButtonStartMeniu from "@/components/meniu/ButtonStartMeniu";

export default function Home() {
  const t = useTranslations("Meniu");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 300);
  }, []);

  return (
    <>
      <div
        className={`transform transition-all duration-700 
        flex flex-col  items-center gap-14  pt-40 ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
        }`}
      >
        <ButtonStartMeniu page={`/meniu-vip/bar`} text={t("bar")} />
        <ButtonStartMeniu page={`/meniu-vip/cusine`} text={t("cusine")} />
        <ButtonStartMeniu
          page={`/meniu-vip/daily-meniu`}
          text={t("Daily Menu")}
        />
        <ButtonStartMeniu
          page={`/meniu-vip/staff-menu`}
          text={t("Staff Menu")}
        />
      </div>
    </>
  );
}
