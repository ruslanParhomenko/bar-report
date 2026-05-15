"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type LegendItem<T extends string> = {
  key: T;
  color: string;
  label: string;
};

type CustomLegendProps<T extends string> = {
  items: LegendItem<T>[];
  visibleItems: Record<T, boolean>;
  onToggle: (key: T) => void;
  className?: string;
};

export default function CustomLegend<T extends string>({
  items,
  visibleItems,
  onToggle,
  className,
}: CustomLegendProps<T>) {
  const isMobile = useIsMobile();
  return (
    <div
      className={cn(
        "mt-4 flex flex-wrap justify-center gap-1 md:gap-4",
        className,
      )}
    >
      {items.map(({ key, color, label }) => (
        <button
          key={key}
          onClick={() => onToggle(key)}
          className={cn(
            "flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-opacity",
            !visibleItems[key] && "opacity-35",
          )}
        >
          <span
            className="inline-block h-3 w-3 rounded-sm"
            style={{ backgroundColor: color }}
          />

          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
