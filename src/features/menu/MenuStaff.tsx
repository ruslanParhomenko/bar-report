"use client";
import { type StaffMenu, useGoogleData } from "@/hooks/useGoogleData";
import { getCurrentDay } from "@/utils/getCurrentDay";
import { Label } from "@radix-ui/react-label";

export function MenuStaff() {
  const currentDay = getCurrentDay();
  const { menu: data } = useGoogleData();
  const currentDayMenu = data?.staff[currentDay as keyof StaffMenu] ?? [];
  return (
    <div className="flex flex-col font-bold h-[60vh] w-full justify-center items-center">
      <Label className="text-2xl pb-5">{currentDay}</Label>
      {currentDay &&
        currentDayMenu.map((el: string, index: number) => (
          <div className="py-2 text-base" key={index}>
            {el}
          </div>
        ))}
    </div>
  );
}
