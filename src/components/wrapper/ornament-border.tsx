import { cn } from "@/lib/utils";

export function OrnamentBorder({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="relative h-full w-full px-2 py-1">
        <Ornament
          className={cn("top-0 left-0 h-10 w-10 rotate-90", className)}
        />
        <Ornament
          className={cn("top-0 right-0 h-10 w-10 rotate-180", className)}
        />
        <Ornament className={cn("bottom-0 left-0 h-10 w-10", className)} />
        <Ornament
          className={cn("right-0 bottom-0 h-10 w-10 -rotate-90", className)}
        />

        <div className="relative z-10 h-full">{children}</div>
      </div>
    </div>
  );
}

function Ornament({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute select-none ${className}`}
      style={{
        backgroundImage: "url('/pattern.svg')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        width: "2.5rem",
        height: "2.5rem",
      }}
    />
  );
}
