"use client";
import { useFormId } from "@/hooks/use-form-id";
import { FieldValues, SubmitHandler, UseFormReturn } from "react-hook-form";
import { Form } from "../ui/form";

type FormWrapperProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  onError?: (errors: any) => void;
  children: React.ReactNode;
  className?: string;
  swipeHandlers?: ReturnType<typeof import("react-swipeable").useSwipeable>;
};

export default function FormWrapper<T extends FieldValues>({
  form,
  onSubmit,
  onError,
  children,
  className,
  swipeHandlers,
}: FormWrapperProps<T>) {
  const formId = useFormId();

  return (
    <Form {...form}>
      <form
        {...swipeHandlers}
        onSubmit={form.handleSubmit(onSubmit, onError ? onError : undefined)}
        className={className}
        id={formId}
      >
        {children}
      </form>
    </Form>
  );
}
