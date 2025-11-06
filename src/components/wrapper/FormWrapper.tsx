import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { Form } from "../ui/form";

export function FormWrapper({
  form,
  children,
  onSubmit,
  className,
  ...props
}: {
  form: UseFormReturn<any>;
  children: React.ReactNode;
  onSubmit?: SubmitHandler<any>;
  className?: string;
  [key: string]: any;
}) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit || (() => {}))}
        className={className}
        {...props}
      >
        {children}
      </form>
    </Form>
  );
}
