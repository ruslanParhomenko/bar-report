"use client";
import { usePathname } from "next/navigation";
import { FieldValues, SubmitHandler, UseFormReturn } from "react-hook-form";
import { Form } from "../ui/form";

type FormWrapperProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  onError?: (errors: any) => void;
  children: React.ReactNode;
  className?: string;
};

export default function FormWrapper<T extends FieldValues>({
  form,
  onSubmit,
  onError,
  children,
  className,
}: FormWrapperProps<T>) {
  const pathname = usePathname();
  const mainRoute = pathname.split("/")[1] || "";
  const formId = `${mainRoute}-form`;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError ? onError : undefined)}
        className={className}
        id={formId}
      >
        {children}
      </form>
    </Form>
  );
}
