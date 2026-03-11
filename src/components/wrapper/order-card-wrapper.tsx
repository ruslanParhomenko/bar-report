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
      <div className="flex flex-col w-60 justify-center items-center">
        <Label className="py-2 font-bold text-bl">{name}</Label>
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
      <div className="grid-cols-[72%_10%_16%] grid">
        {item && (
          <Label
            className={`pl-2 text-sm text-muted-foreground ${value ? "text-rd" : ""}`}
          >
            {item}
          </Label>
        )}
        {!item && (
          <input
            type="text"
            data-slot="input"
            className={`pl-2 text-sm text-muted-foreground ${value ? "text-rd" : ""}`}
            {...register(`${item} + ${String(index)}`)}
          />
        )}

        <button
          type="button"
          className="text-rd font-bold cursor-pointer"
          data-html2canvas-ignore="true"
          onClick={() => setValue(item, "")}
        >
          {value ? <Trash2Icon className="w-4 h-4" /> : null}
        </button>

        <NumericInput
          fieldName={item || String(index)}
          className="w-10! text-center h-6.5!"
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
