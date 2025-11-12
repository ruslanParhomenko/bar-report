import { useEffect, useState } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export function useLocalStorageForm<T extends FieldValues>(
  form: UseFormReturn<T>,
  key: string
) {
  const [isLoaded, setIsLoaded] = useState(false);

  // set data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(key);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        form.reset(parsedData);
      } catch (error) {
        console.error("Error parsing saved data:", error);
      }
    }
    setIsLoaded(true);
  }, [form, key]);

  // save data to localStorage
  const watchAllFields = form.watch();
  useEffect(() => {
    if (isLoaded && watchAllFields) {
      localStorage.setItem(key, JSON.stringify(watchAllFields));
    }
  }, [watchAllFields, isLoaded, key]);

  const resetForm = (defaultValues: T) => {
    form.reset(defaultValues);
    if (isLoaded) {
      localStorage.removeItem(key);
    }
  };

  return { isLoaded, resetForm };
}
