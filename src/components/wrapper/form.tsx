"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, UseFormReturn } from "react-hook-form";
import SendOrdersButton from "../buttons/screen-button";
import ModalConfirm from "../modal/modal-confirm";
import { Button } from "../ui/button";
import { Form } from "../ui/form";

type FormInputProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  resetForm?: () => void;
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
  id?: string;
};

export default function FormInput<T extends FieldValues>({
  form,
  onSubmit,
  resetForm,
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
  id,
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
        className={cn("flex h-[95vh] flex-col", className)}
        id={id}
      >
        {children}

        {withButtons && (
          <div
            className="bg-background sticky bottom-0 z-30 mt-auto flex w-full justify-start gap-6 px-4 py-1"
            data-html2canvas-ignore="true"
          >
            {!sendTelegram && (
              <Button
                type="submit"
                className="bg-bl mt-auto h-7 w-24 text-white"
                disabled={disabled}
              >
                save
              </Button>
            )}
            {sendTelegram && (
              <SendOrdersButton
                componentRef={ref}
                disabled={!ref}
                patch={url || ""}
                className="w-24"
              />
            )}

            <ModalConfirm
              open={isModalOpen}
              setOpen={setIsModalOpen}
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
                className="hover:bg-rd text-bl h-7 w-24 hover:text-black"
                onClick={() =>
                  resetForm ? resetForm() : form.reset(defaultValues || {})
                }
                disabled={disabled}
              >
                reset
              </Button>
            )}
            {returnButton && (
              <Button
                type="button"
                variant={"destructive"}
                className="h-7 w-24"
                onClick={() => (url ? router.replace(url) : router.back())}
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
