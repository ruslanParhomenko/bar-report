import { BarConfig } from "@/components/chart/types";

export function toggleBarVisibility<T extends string>(
  items: BarConfig<T>[],
  key: T,
): BarConfig<T>[] {
  return items.map((item) =>
    item.key === key ? { ...item, visible: !item.visible } : item,
  );
}
