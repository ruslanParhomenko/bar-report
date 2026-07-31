import { cn } from "@/lib/utils";

type LegendItem<T extends string> = {
  key: T;
  color: string;
  visible: boolean;
};

type CustomLegendProps<T extends string> = {
  items: LegendItem<T>[];
  onToggle: (key: T) => void;
  className?: string;
};

export default function CustomLegend<T extends string>({
  items,
  onToggle,
  className,
}: CustomLegendProps<T>) {
  return (
    <div
      className={cn(
        "my-1 flex flex-wrap justify-center gap-1 md:my-3 md:gap-8",
        className,
      )}
    >
      {items.map(({ key, color, visible }) => (
        <button
          type="button"
          key={key}
          onClick={() => onToggle(key)}
          className={cn(
            "flex cursor-pointer items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-opacity md:gap-2 md:px-3 md:text-sm",
            !visible && "opacity-35 print:hidden",
          )}
        >
          <span
            className="inline-block h-2 w-2 rounded-sm md:h-3 md:w-3"
            style={{ backgroundColor: color }}
          />

          <span>{key}</span>
        </button>
      ))}
    </div>
  );
}
