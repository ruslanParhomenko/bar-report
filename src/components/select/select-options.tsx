import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
      <SelectContent>
        {options.map((item, idx) => (
          <SelectItem key={`${item.value}-${idx}`} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
