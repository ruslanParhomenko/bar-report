import { MenuItem } from "@/app/actions/data-constants/data-menu-action";
import { LocalTranslateFn } from "./types";

export function Row({ item, t }: { item: MenuItem; t: LocalTranslateFn }) {
  if (!item.name && item.price == null) return null;

  return (
    <div className="my-0 grid grid-cols-[2fr_1fr_auto] items-baseline gap-1 text-xs tracking-wider text-[#1a1a1a] md:gap-3 print:my-1.5">
      <span className="overflow-hidden whitespace-nowrap md:text-ellipsis">
        {item.name ? t(item.name) : ""}
      </span>

      <span
        className="shrink-0 whitespace-nowrap text-[#777]"
        style={{ fontSize: "0.56rem" }}
      >
        {item.weight}
      </span>

      {item.price != null && (
        <span className="w-6 shrink-0 text-left font-semibold">
          {item.price}
        </span>
      )}
    </div>
  );
}
