"use client";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useAbility } from "@/providers/AbilityProvider";
import { useFormContext, useWatch } from "react-hook-form";

import NumericInput from "../inputs/NumericInput";

export function OrderCardWrapper({
  data,
  name,
}: {
  data: string[];
  name: string;
}) {
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
            <div className="grid-cols-[65%_25%_10%] grid">
              <Label className={`text-sm ${value ? "text-rd" : ""}`}>
                {item}
              </Label>
              <NumericInput
                fieldName={item}
                disabled={isObserver}
                className="w-16! text-center h-7!"
              />
              {/* <SelectInput
                fieldName={item}
                fieldLabel={item}
                data={QUANTITY_SELECT}
                disabled={isObserver}
              /> */}
              {value && (
                <button
                  type="button"
                  className=" text-rd front-bold cursor-pointer"
                  onClick={() => setValue(item, "")}
                >
                  X
                </button>
              )}
            </div>
            {data.length - 1 !== index && <Separator className="my-1" />}
          </div>
        );
      })}
    </div>
  );
}
