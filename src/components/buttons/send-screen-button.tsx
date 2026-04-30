"use client";
import { sendToTelegram } from "@/app/actions/telegram/telegram-action";
import { cn } from "@/lib/utils";
import { RefContext } from "@/providers/client-ref-provider";
import html2canvas from "html2canvas-pro";
import { SendIcon } from "lucide-react";
import { useContext, useTransition } from "react";
import { toast } from "sonner";

export default function SendScreenButton({
  componentRef,
  className,
  patch,
  disabled = false,
  size = 18,
}: {
  componentRef?: React.RefObject<HTMLDivElement | null> | null;
  className?: string;
  patch: string;
  disabled?: boolean;
  size?: number;
}) {
  const [isPending, startTransition] = useTransition();

  const ref = componentRef || useContext(RefContext);

  const sendScreenshot = async () => {
    if (!ref?.current) return;

    try {
      const canvas = await html2canvas(ref.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fff",
      });

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );

      if (!blob) throw new Error("no blob");

      const formData = new FormData();
      formData.append("file", blob);

      await sendToTelegram(formData, patch);

      toast.success("График отправлен");
    } catch (e) {
      toast.error("Ошибка при отправке графика");
    }
  };
  return (
    <button
      type="button"
      onClick={() => startTransition(sendScreenshot)}
      disabled={disabled || isPending}
      className={cn(className, "cursor-pointer")}
    >
      <SendIcon
        size={size}
        className={cn("text-bl hover:text-black", disabled && "opacity-50")}
        strokeWidth={1.5}
      />
    </button>
  );
}
