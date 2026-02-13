import { useMemo } from "react";

type Option = { value: string; label: string };

interface UseUniqueOptionsProps<T> {
  data: T[];
  getValue: (item: T) => string | number | undefined | null;
  getLabel?: (value: string | number) => string;
  includeAll?: boolean;
  allLabel?: string;
}

export function useUniqueOptions<T>({
  data,
  getValue,
  getLabel,
  includeAll = true,
  allLabel = "Все",
}: UseUniqueOptionsProps<T>): Option[] {
  return useMemo(() => {
    const set = new Set<string>();

    data.forEach((item) => {
      const val = getValue(item);
      if (val !== undefined && val !== null && String(val).trim() !== "") {
        set.add(String(val));
      }
    });

    const options = Array.from(set).map((v) => ({
      value: v,
      label: getLabel ? getLabel(v) : String(v),
    }));

    if (includeAll) {
      return [{ value: "all", label: allLabel }, ...options];
    }

    return options;
  }, [data, getValue, getLabel, includeAll, allLabel]);
}
