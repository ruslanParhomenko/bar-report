import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { UseFieldArrayReturn } from "react-hook-form";

export function AddRemoveFieldsButton({
  formField,
  defaultValues,
  index,
  disabled,
  className,
}: {
  formField: UseFieldArrayReturn<any>;
  defaultValues: any;
  index: number;
  disabled?: boolean;
  className?: string;
}) {
  const { theme } = useTheme();
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
    <div className={cn("flex gap-1 justify-center items-center", className)}>
      <Button
        type="button"
        variant={"outline"}
        size="icon"
        className={cn(
          "border-rd border-1 text-rd",
          theme === "dark" ? "border-0" : ""
        )}
        onClick={handleRemove}
        disabled={disabled}
      >
        -
      </Button>

      {(isOnlyOne || isLast) && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={cn(
            "text-bl border-bl border-1",
            theme === "dark" ? "border-0" : ""
          )}
          onClick={() => formField.append(defaultValues)}
          disabled={disabled}
        >
          +
        </Button>
      )}
    </div>
  );
}
