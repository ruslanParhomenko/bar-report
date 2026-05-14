// components/charts/custom-tooltip.tsx
import { Card, CardContent } from "@/components/ui/card";
import { TooltipContentProps } from "recharts";

export default function CustomTooltip({
  active,
  payload,
  label,
  unit = "ч",
}: TooltipContentProps<number, string> & { unit?: string }) {
  if (!active || !payload?.length) return null;

  return (
    <Card className="border-border shadow-lg">
      <CardContent className="space-y-1 p-3">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((entry, i) => (
          <p
            key={i}
            className="text-muted-foreground flex items-center gap-2 text-sm"
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: entry.fill ?? entry.color }}
            />
            {entry.name}:
            <span className="text-foreground font-medium">
              {entry.value}
              {unit}
            </span>
          </p>
        ))}
      </CardContent>
    </Card>
  );
}
