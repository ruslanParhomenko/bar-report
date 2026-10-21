"use client";
import { useCallback, useEffect, useState } from "react";

export function usePersistentOrder(key: string, defaultOrder: string[]) {
  const [order, setOrderState] = useState(defaultOrder);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const saved: string[] = JSON.parse(raw);

        const valid = saved.filter((id) => defaultOrder.includes(id));
        const missing = defaultOrder.filter((id) => !valid.includes(id));
        setOrderState([...valid, ...missing]);
      }
    } catch {}
    setReady(true);
  }, [key]);

  const setOrder = useCallback(
    (next: string[]) => {
      setOrderState(next);
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {}
    },
    [key],
  );

  return [order, setOrder, ready] as const;
}
