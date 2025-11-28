"use client";
import { sendToTelegram } from "@/app/actions/telegram/sendToTelegram";
import { cn } from "@/lib/utils";
import html2canvas from "html2canvas-pro";
import { MailIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function MailButton({
  componentRef,
  patch,
  disabled,
  className,
}: {
  componentRef?: React.RefObject<HTMLDivElement | null> | null;
  patch: string;
  disabled: boolean;
  className?: string;
}) {
  const [isSending, setIsSending] = useState(false);

  const sendScreenshot = async (caption = "") => {
    if (!componentRef) return;

    try {
      setIsSending(true);

      const canvas =
        componentRef.current &&
        (await html2canvas(componentRef.current, {
          scale: 3,
          useCORS: true,
          backgroundColor: "#ffffff",
        }));

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas?.toBlob((b) => resolve(b), "image/png")
      );

      if (!blob) throw new Error("Failed to create image blob");

      const formData = new FormData();

      formData.append("file", blob, "screenshot.png");
      formData.append("caption", caption);

      await sendToTelegram(formData, patch);

      toast.success("График отправлен");

      return true;
    } catch (err: any) {
      toast.error("Произошла ошибка");
      return false;
    } finally {
      setIsSending(false);
    }
  };
  return (
    <button
      type="button"
      onClick={() => {
        sendScreenshot();
      }}
      disabled={disabled || isSending}
      className={cn("cursor-pointer", disabled && "opacity-50", className)}
    >
      <MailIcon className="h-5 w-5 hover:text-bl" strokeWidth={1.5} />
    </button>
  );
}
