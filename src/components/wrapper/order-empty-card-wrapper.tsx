"use client";

import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useFormContext, useWatch } from "react-hook-form";
import { useTheme } from "next-themes";
import TextInput from "../inputs/text-input";
import { cn } from "@/lib/utils";
import { Trash2Icon } from "lucide-react";

export function OrderEmptyCardWrapper({
  data,
  name,
}: {
  data: string[];
  name: string;
}) {
  return (
    <>
      <div className="flex flex-col w-full justify-center items-center py-2">
        <Label className="py-2 font-bold text-bl">{name}</Label>
      </div>

      {data.map((_item, index) => (
        <EmptyField key={index} fieldName={index} />
      ))}
    </>
  );
}

function EmptyField({ fieldName }: { fieldName: number }) {
  const { theme } = useTheme();

  const { setValue, control } = useFormContext();

  const valueQuantity = useWatch({ control, name: `${fieldName}.quantity` });
  const valueName = useWatch({ control, name: `${fieldName}.name` });
  return (
    <div>
      <div className="grid-cols-[68%_10%_16%] grid justify-center items-center">
        <TextInput
          type="text"
          fieldName={`${fieldName}.name`}
          className={cn(
            "h-7! w-4/5 ",
            theme === "dark" ? "border-0" : "",
            valueName ? "bg-background!" : "",
          )}
        />
        <button
          type="button"
          className="text-rd font-bold cursor-pointer pb-2"
          onClick={() => {
            setValue(`${fieldName}.name`, "");
            setValue(`${fieldName}.quantity`, "");
          }}
          data-html2canvas-ignore="true"
        >
          {valueName || valueQuantity ? (
            <Trash2Icon className="w-4 h-4" />
          ) : null}
        </button>

        <TextInput
          type="text"
          fieldName={`${fieldName}.quantity`}
          className={cn(
            "w-12! text-center h-7!",
            theme === "dark" ? "border-0" : "",
            valueQuantity ? "bg-background!" : "",
          )}
        />
      </div>
      <Separator className={`${theme === "dark" ? "my-1 bg-black" : "my-1"}`} />
    </div>
  );
}
