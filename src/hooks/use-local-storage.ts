"use client";
import { useEffect, useState } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export function useLocalStorageForm<T extends FieldValues>(
  form: UseFormReturn<T>,
  key: string,
) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem(key);

    if (savedData) {
      try {
        form.reset(JSON.parse(savedData));
      } catch (error) {
        console.error("Error parsing saved data:", error);
      }
    }

    setIsLoaded(true);
  }, [form, key]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (isLoaded) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    });

    return () => subscription.unsubscribe();
  }, [form, key, isLoaded]);

  const resetForm = (defaultValues: T) => {
    form.reset(defaultValues);
    localStorage.removeItem(key);
  };

  const removeLocalStorageKey = () => {
    localStorage.removeItem(key);
  };

  return { isLoaded, resetForm, removeLocalStorageKey };
}
