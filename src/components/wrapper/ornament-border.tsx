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
        <Ornament rotation={90} className={cn("top-0 left-0", className)} />
        <Ornament rotation={180} className={cn("top-0 right-0", className)} />
        <Ornament rotation={0} className={cn("bottom-0 left-0", className)} />
        <Ornament
          rotation={270}
          className={cn("right-0 bottom-0", className)}
        />

        <div className="relative z-10 h-full">{children}</div>
      </div>
    </div>
  );
}

function Ornament({
  className = "",
  rotation = 0,
}: {
  className?: string;
  rotation?: number;
}) {
  return (
    <img
      src="/pattern.svg"
      alt=""
      aria-hidden
      draggable={false}
      className={`pointer-events-none absolute h-10 w-10 select-none ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
      width={40}
      height={40}
    />
  );
}
