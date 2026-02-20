"use client";

import { SubmitHandler, UseFormReturn, FieldValues } from "react-hook-form";
import { Form } from "../ui/form";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import ModalConfirm from "../modal/modal-confirm";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MailButton from "../buttons/mail-button";

type FormInputProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  onError?: (errors: any) => void;
  children: React.ReactNode;
  className?: string;
  withButtons?: boolean;
  resetButton?: boolean;
  returnButton?: boolean;
  disabled?: boolean;
  sendTelegram?: boolean;
  ref?: React.RefObject<HTMLDivElement | null> | null;
  url?: string;
  defaultValues?: any;
};

export default function FormInput<T extends FieldValues>({
  form,
  onSubmit,
  onError,
  children,
  className,
  withButtons = true,
  resetButton = false,
  returnButton = false,
  disabled = false,
  sendTelegram = false,
  ref,
  url,
  defaultValues,
}: FormInputProps<T>) {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formDataToSubmit, setFormDataToSubmit] = useState<T | null>(null);
  const handleFormSubmit: SubmitHandler<T> = (data) => {
    setFormDataToSubmit(data);
    setIsModalOpen(true);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit, onError || (() => {}))}
        className={cn("flex flex-col h-[93vh]", className)}
      >
        {children}

        {withButtons && (
          <div
            className="sticky bottom-0 w-full flex justify-start gap-6 px-4 py-2 mt-auto bg-background z-30"
            data-html2canvas-ignore="true"
          >
            {!sendTelegram && (
              <Button
                type="submit"
                className="bg-bl text-white mt-auto h-8 w-24"
                disabled={disabled}
              >
                save
              </Button>
            )}
            {sendTelegram && (
              <MailButton
                componentRef={ref}
                disabled={!ref}
                patch={url || ""}
                className="w-24"
              />
            )}

            <ModalConfirm
              open={isModalOpen}
              setOpen={setIsModalOpen}
              message="save"
              handleConfirm={async () => {
                if (!formDataToSubmit) return;

                await onSubmit(formDataToSubmit);

                setIsModalOpen(false);
                setFormDataToSubmit(null);
              }}
            />
            {resetButton && (
              <Button
                type="button"
                variant="secondary"
                className="hover:bg-rd text-bl hover:text-black h-8 w-24"
                onClick={() => form.reset(defaultValues || {})}
                disabled={disabled}
              >
                reset
              </Button>
            )}
            {returnButton && (
              <Button
                type="button"
                variant={"destructive"}
                className="h-8 w-24"
                onClick={() => router.back()}
                disabled={disabled}
              >
                return
              </Button>
            )}
          </div>
        )}
      </form>
    </Form>
  );
}
