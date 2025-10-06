"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { useTheme } from "next-themes";
import { UseFieldArrayReturn } from "react-hook-form";

type ActionsButtonProps = {
  formFields: UseFieldArrayReturn<any>;
  idx: number;
  item: any;
  disabled: boolean;
  defaultValues: any;
  sendData?: (data: any) => void;
};

export const ActionsButton = ({
  formFields,
  idx,
  item,
  disabled,
  defaultValues,
  sendData,
}: ActionsButtonProps) => {
  const { theme } = useTheme();
  const handleRemove = () => {
    if (formFields.fields.length === 1) {
      formFields.replace([defaultValues]);
    } else {
      formFields.remove(idx);
    }
    sendData && sendData(formFields?.fields[0]);
  };

  const handleAdd = () => {
    const firstItem = formFields.fields[0] as Record<string, any>;
    if (firstItem && firstItem[Object.keys(firstItem)[1]] !== "") {
      formFields.append(defaultValues);
    }
  };

  return (
    <div className="flex md:flex-row flex-col gap-2 md:justify-start justify-end">
      {(item || idx === formFields.fields.length - 1) && (
        <Button
          type="button"
          variant="outline"
          onClick={handleRemove}
          disabled={disabled}
          className={cn(
            "border-rd border-1 text-rd",
            theme === "dark" ? "border-0" : ""
          )}
        >
          <Minus />
        </Button>
      )}
      {idx === formFields.fields.length - 1 && (
        <Button
          type="button"
          variant="outline"
          onClick={handleAdd}
          disabled={disabled || !item}
          className={cn(
            "border-bl border-1 text-bl",
            theme === "dark" ? "border-0" : ""
          )}
        >
          <Plus />
        </Button>
      )}
    </div>
  );
};
