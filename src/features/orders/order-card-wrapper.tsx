import { Label } from "@/components/ui/label";
import { useFormContext, useWatch } from "react-hook-form";
import OrderCardField from "./order-card-field";

export default function OrderCardWrapper({
  data,
  name,
}: {
  data: string[];
  name: string;
}) {
  const { control, setValue } = useFormContext();
  const categoryValues = useWatch({ control, name });

  const hasValues =
    categoryValues &&
    typeof categoryValues === "object" &&
    !Array.isArray(categoryValues) &&
    Object.values(categoryValues).some(
      (v) => v !== "" && v !== null && v !== undefined,
    );

  const resetCategory = () => {
    if (!categoryValues) return;
    Object.keys(categoryValues).forEach((key) => {
      setValue(`${name}.${key}`, "");
    });
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <Label
          className={`cursor-pointer py-1.5 font-bold transition-colors ${hasValues ? "text-rd" : "text-bl"}`}
          onClick={hasValues ? resetCategory : undefined}
        >
          {name}
        </Label>
      </div>
      {data?.map((item, index) => (
        <OrderCardField
          key={`${item}-${index}`}
          index={index}
          item={item}
          category={name}
          isLast={index === data.length - 1}
        />
      ))}
    </div>
  );
}
