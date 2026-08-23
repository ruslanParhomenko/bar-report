import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

export default function SelectOptions({
  options,
  value,
  onChange,
  isLoading = false,
  className,
  placeHolder,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
  className?: string;
  placeHolder?: string;
}) {
  return (
    <Select
      value={value}
      onValueChange={(value) => onChange(value)}
      disabled={isLoading}
    >
      <SelectTrigger
        className={cn(
          "bg-background justify-center border-0 shadow-none [&>svg]:hidden",
          className,
        )}
      >
        <SelectValue placeholder={placeHolder ?? ""} />
      </SelectTrigger>
      <SelectContent className="mt-4">
        <div className="grid grid-cols-3 gap-3 p-2">
          {options.map((item, idx) => (
            <SelectItem
              key={`${item.value}-${idx}`}
              value={item.value}
              className="border-border flex h-9 items-center justify-center border p-0 px-3 text-center [&>span:first-child]:hidden"
            >
              {item.label}
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </Select>
  );
}
