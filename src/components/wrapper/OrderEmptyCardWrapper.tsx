"use client";

import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useAbility } from "@/providers/AbilityProvider";
import { useFormContext } from "react-hook-form";
import { useTheme } from "next-themes";

import NumericInput from "../inputs/NumericInput";
import TextInput from "../inputs/TextInput";

export function OrderEmptyCardWrapper({
  data,
  name,
}: {
  data: string[];
  name: string;
}) {
  const { control } = useFormContext();

  return (
    <div>
      <div className="flex flex-col w-full justify-center items-center py-2">
        <Label className="py-2 font-bold text-bl">{name}</Label>
      </div>

      {data.map((field, index) => (
        <EmptyField key={index} fieldName={index} />
      ))}
    </div>
  );
}

function EmptyField({ fieldName }: { fieldName: number }) {
  const { theme } = useTheme();
  const { isObserver } = useAbility();

  return (
    <div>
      <div className="flex flex-row items-center justify-between gap-2 pb-3">
        <TextInput
          type="text"
          fieldName={`${fieldName}.name`}
          className={`h-7 w-4/5 ! ${theme === "dark" ? "border-0" : ""}`}
        />

        <NumericInput
          fieldName={`${fieldName}.quantity`}
          disabled={isObserver}
          className={`w-12! text-center h-7! ${
            theme === "dark" ? "border-0" : ""
          }`}
        />
      </div>
    </div>
  );
}
