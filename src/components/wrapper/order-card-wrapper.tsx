"use client";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useFormContext, useWatch } from "react-hook-form";

import NumericInput from "../inputs/numeric-input";
import { useTheme } from "next-themes";
import { Trash2Icon } from "lucide-react";

export function OrderCardWrapper({
  data,
  name,
}: {
  data: string[];
  name: string;
}) {
  return (
    <div>
      <div className="flex flex-col w-full justify-center items-center">
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
  const { setValue, control } = useFormContext();

  const value = useWatch({ control, name: item });

  return (
    <div>
      <div className="grid-cols-[72%_10%_16%] grid">
        <Label
          className={`pl-2 text-sm text-muted-foreground ${value ? "text-rd" : ""}`}
        >
          {item}
        </Label>

        <button
          type="button"
          className="text-rd font-bold cursor-pointer"
          onClick={() => setValue(item, "")}
        >
          {value ? <Trash2Icon className="w-4 h-4" /> : null}
        </button>

        <NumericInput fieldName={item} className="w-10! text-center h-6.5!" />
      </div>
      {!isLast && (
        <Separator
          className={`${theme === "dark" ? "my-1 bg-black" : "my-1"}`}
        />
      )}
    </div>
  );
}
