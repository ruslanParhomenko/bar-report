import { useEffect, useRef } from "react";

export function useRealtimeSave<T>(
  value: T,
  enabled: boolean,
  callback: (data: T) => Promise<void>,
  delay = 6000,
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevValueRef = useRef<string | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled || !value) return;

    const serialized = JSON.stringify(value);

    if (prevValueRef.current === serialized) return;

    prevValueRef.current = serialized;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current(value).catch(console.error);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, enabled, delay]);
}
