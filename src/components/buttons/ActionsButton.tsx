"use client";
import { cn } from "@/lib/utils";
import { Plus, Trash2Icon } from "lucide-react";
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
    <div className="flex flex-row  gap-6  justify-start">
      {(item || idx === formFields.fields.length - 1) && (
        <button
          type="button"
          onClick={handleRemove}
          disabled={disabled}
          className={cn("h-9 cursor-pointer")}
        >
          <Trash2Icon className="w-4 h-4 text-rd" />
        </button>
      )}
      {idx === formFields.fields.length - 1 ? (
        <button
          type="button"
          onClick={handleAdd}
          disabled={disabled || !item}
          className={cn("h-9 cursor-pointer")}
        >
          <Plus className="h-4 w-4 text-bl font-bold" />
        </button>
      ) : (
        <div className="h-9 w-4"></div>
      )}
    </div>
  );
};
