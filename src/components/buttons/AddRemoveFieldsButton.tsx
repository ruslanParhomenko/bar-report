import { cn } from "@/lib/utils";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { UseFieldArrayReturn } from "react-hook-form";

export function AddRemoveFieldsButton({
  formField,
  defaultValues,
  index,
  disabled = false,
  className,
}: {
  formField: UseFieldArrayReturn<any>;
  defaultValues: any;
  index: number;
  disabled?: boolean;
  className?: string;
}) {
  const isOnlyOne = formField.fields?.length === 1;
  const isLast = index === formField.fields?.length - 1;

  const handleRemove = () => {
    if (isOnlyOne) {
      formField.replace([defaultValues]);
    } else {
      formField.remove(index);
    }
  };

  return (
    <div
      className={cn(
        "flex gap-2 md:gap-6 justify-center items-start",
        className,
      )}
    >
      {isOnlyOne || isLast ? (
        <button
          type="button"
          className={cn("h-8")}
          onClick={() => formField.append(defaultValues)}
          disabled={disabled}
        >
          <PlusIcon className="size-4 text-bl font-bold cursor-pointer" />
        </button>
      ) : (
        <div className="h-8 w-4"></div>
      )}
      <button
        type="button"
        className={cn("h-8")}
        onClick={handleRemove}
        disabled={disabled}
      >
        <Trash2Icon className="size-4 text-rd cursor-pointer" />
      </button>
    </div>
  );
}
