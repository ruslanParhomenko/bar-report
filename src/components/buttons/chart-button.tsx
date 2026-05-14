import { cn } from "@/lib/utils";
import { ChartArea } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChartButton({
  size = 18,
  url,
  className,
  disabled = false,
}: {
  size?: number;
  url?: string;
  className?: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  return (
    <button
      onClick={() => url && router.push(url)}
      className={cn(
        className,
        "cursor-pointer hover:text-black",
        disabled && "opacity-50",
      )}
      type="button"
      disabled={!url || disabled}
    >
      <ChartArea size={size} className="text-bl" strokeWidth={1.5} />
    </button>
  );
}
