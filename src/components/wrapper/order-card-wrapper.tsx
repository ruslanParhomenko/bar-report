"use client";
import { useFormContext, useWatch } from "react-hook-form";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

import { useTheme } from "next-themes";
import NumericInput from "../input-controlled/numeric-input";

export function OrderCardWrapper({
  data,
  name,
}: {
  data: string[];
  name: string;
}) {
  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <Label className="text-bl py-2 font-bold">{name}</Label>
      </div>
      {data?.map((item, index) => (
        <OrderCardField
          key={`${item}-${index}`}
          index={index}
          item={item}
          isLast={index === data.length - 1}
        />
      ))}
    </div>
  );
}

function OrderCardField({
  item,
  index,
  isLast,
}: {
  item: string;
  index: number;
  isLast: boolean;
}) {
  const { theme } = useTheme();
  const { setValue, control, register } = useFormContext();

  const value = useWatch({ control, name: item });

  return (
    <div>
      <div className="grid grid-cols-[82%_8%]">
        {item && (
          <Label
            className={`text-muted-foreground cursor-pointer pl-1 text-sm ${value ? "text-rd" : ""}`}
            onClick={() => setValue(item, "")}
          >
            {item}
          </Label>
        )}
        {!item && (
          <input
            type="text"
            data-slot="input"
            className={`text-muted-foreground pl-1 text-sm ${value ? "text-rd" : ""}`}
            {...register(`${item} + ${String(index)}`)}
          />
        )}

        <NumericInput
          fieldName={item || String(index)}
          className="h-6.5! w-9! text-center"
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
