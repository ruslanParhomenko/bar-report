import { cn } from "@/lib/utils";

type Props = {
  names: string[];
  activeName: string;
  onChange: (name: string) => void;
  isVisible?: boolean;
};

export default function NameFilter({
  names,
  activeName,
  onChange,
  isVisible,
}: Props) {
  if (!isVisible) return null;
  return (
    <div className="flex flex-wrap justify-center gap-1 md:px-4 md:pb-2">
      {names.map((name) => (
        <span
          key={name}
          onClick={() => onChange(activeName === name ? "" : name)}
          className={cn(
            "hover:text-rd cursor-pointer rounded-full px-1 py-0.5 text-xs transition-opacity",
            activeName && activeName !== name && "opacity-35",
            activeName !== name && "print:hidden",
          )}
        >
          {name}
        </span>
      ))}
    </div>
  );
}
