"use client";

import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { Form } from "../ui/form";
import SubmitButton from "../buttons/submit-button";
import { cn } from "@/lib/utils";
import SelectTabsByPatch from "../nav/select-patch";
import { useEffect, useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";

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
  disabled = false,
  routerItems = [],
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
  disabled?: boolean;
  routerItems?: Array<{
    title: string;
    href: string;
  }>;
  [key: string]: any;
}) {
  const router = useRouter();
  const pathname = usePathname().split("/")[1];

  const [isPending, startTransition] = useTransition();

  const handlePatchChange = (patch: string) => {
    if (!patch || patch === pathname) return;

    startTransition(() => {
      router.replace(`/${patch}`);
    });
  };

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

        <div className="flex justify-between mt-auto">
          {routerItems.length > 0 && (
            <SelectTabsByPatch
              patch={pathname || null}
              setPatch={handlePatchChange}
              isPending={isPending}
              navItems={routerItems}
            />
          )}

          {withButtons && (
            <SubmitButton
              reset={resetButton}
              resetForm={resetForm}
              returnButton={returnButton}
              isDisabled={disabled || isPending}
            />
          )}
        </div>
      </form>
    </Form>
  );
}
