import { useEffect, useRef } from "react";

export function useRealtimeSave<T>(
  value: T,
  enabled: boolean,
  callback: (data: T) => Promise<void>,
  delay = 6000,
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || !value) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(value).catch(console.error);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, enabled, callback, delay]);
}
