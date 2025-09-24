"use client";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useAbility } from "@/providers/AbilityProvider";
import { useFormContext, useWatch } from "react-hook-form";

import NumericInput from "../inputs/NumericInput";
import { useTheme } from "next-themes";

export function OrderCardWrapper({
  data,
  name,
}: {
  data: string[];
  name: string;
}) {
  const { theme } = useTheme();
  const { isObserver } = useAbility();
  const { setValue, control } = useFormContext();
  return (
    <div>
      <div className="flex flex-col w-full justify-center items-center py-2">
        <Label className="py-2  font-bold text-bl">{name}</Label>
      </div>
      {data.map((item, index) => {
        const value = useWatch({ control, name: item });
        return (
          <div key={index}>
            <div className="grid-cols-[68%_10%_16%] grid">
              <Label className={`text-sm ${value ? "text-rd" : ""}`}>
                {item}
              </Label>

              <button
                type="button"
                className=" text-rd front-bold cursor-pointer"
                onClick={() => setValue(item, "")}
              >
                {value ? "X" : ""}
              </button>

              <NumericInput
                fieldName={item}
                disabled={isObserver}
                className={`w-12! text-center h-7! ${
                  theme === "dark" ? "border-0" : ""
                }`}
              />
            </div>
            {data.length - 1 !== index && (
              <Separator
                className={`${theme === "dark" ? "my-1 bg-black" : "my-1"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
