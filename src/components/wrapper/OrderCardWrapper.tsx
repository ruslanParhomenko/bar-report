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
  return (
    <div>
      <div className="flex flex-col w-full justify-center items-center py-2">
        <Label className="py-2 font-bold text-bl">{name}</Label>
      </div>
      {data.map((item, index) => (
        <OrderCardField
          key={item}
          item={item}
          isLast={index === data.length - 1}
        />
      ))}
    </div>
  );
}

function OrderCardField({ item, isLast }: { item: string; isLast: boolean }) {
  const { theme } = useTheme();
  const { isObserver } = useAbility();
  const { setValue, control } = useFormContext();

  const value = useWatch({ control, name: item });

  return (
    <div>
      <div className="grid-cols-[68%_10%_16%] grid">
        <Label className={`text-sm ${value ? "text-rd" : ""}`}>{item}</Label>

        <button
          type="button"
          className="text-rd font-bold cursor-pointer"
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
      {!isLast && (
        <Separator
          className={`${theme === "dark" ? "my-1 bg-black" : "my-1"}`}
        />
      )}
    </div>
  );
}
