"use client";
import { useEffect, useRef, useState } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export function useLocalStorageForm<T extends FieldValues>(
  form: UseFormReturn<T>,
  key: string,
  debounceMs = 200,
) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedData = localStorage.getItem(key);
    if (savedData) {
      try {
        form.reset(JSON?.parse(savedData));
      } catch (error) {
        console.error("Error parsing saved data:", error);
      }
    }
    setIsLoaded(true);
  }, [form, key]);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!isLoaded) return;

    const subscription = form.watch((value) => {
      if (typeof window === "undefined") return;

      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.error("Error saving form data:", error);
        }
      }, debounceMs);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutRef.current);
    };
  }, [form, key, isLoaded, debounceMs]);

  return { isLoaded };
}
