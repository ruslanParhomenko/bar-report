import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { Form } from "../ui/form";
import SubmitButton from "../buttons/submit-button";
import { cn } from "@/lib/utils";

export function FormWrapper({
  form,
  children,
  onSubmit,
  onError,
  className,
  resetButton = false,
  returnButton = false,
  resetForm,
  withButtons = true,
  ...props
}: {
  form: UseFormReturn<any>;
  children: React.ReactNode;
  onSubmit?: SubmitHandler<any>;
  onError?: (errors: any) => void;
  className?: string;
  resetButton?: boolean;
  returnButton?: boolean;
  resetForm?: () => void;
  withButtons?: boolean;
  [key: string]: any;
}) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          onSubmit || (() => {}),
          onError || (() => {}),
        )}
        className={cn("flex flex-col h-[93vh]", className)}
        {...props}
      >
        {children}
        {withButtons && (
          <SubmitButton
            reset={resetButton}
            resetForm={resetForm}
            returnButton={returnButton}
          />
        )}
      </form>
    </Form>
  );
}
