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
  setValue,
}: {
  options: string[];
  value: string;
  setValue: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={(value) => setValue(value)}>
      <SelectTrigger className="shadow-none border-0 [&>svg]:hidden justify-start bg-background!">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((name, idx) => (
          <SelectItem key={`${name}-${idx}`} value={name}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
