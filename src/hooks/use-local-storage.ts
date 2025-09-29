"use client";
import { useCallback } from "react";

export const useLocalStorageForm = <T>(key: string) => {
  const isClient = typeof window !== "undefined";

  const getValue = useCallback((): T | null => {
    if (!isClient) return null;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch {
      return null;
    }
  }, [key, isClient]);

  const setValue = useCallback(
    (value: T) => {
      if (!isClient) return;
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {}
    },
    [key, isClient]
  );

  const removeValue = useCallback(() => {
    if (!isClient) return;
    try {
      window.localStorage.removeItem(key);
    } catch {}
  }, [key, isClient]);

  return { getValue, setValue, removeValue };
};
