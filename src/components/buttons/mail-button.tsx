"use client";
import { sendToTelegram } from "@/app/actions/telegram/telegram-action";
import { cn } from "@/lib/utils";
import html2canvas from "html2canvas-pro";
import { MailIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

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
    if (!componentRef?.current) return;

    try {
      setIsSending(true);

      const element = componentRef.current;

      const originalOverflow = element.style.overflow;
      const originalHeight = element.style.height;

      element.style.overflow = "visible";
      element.style.height = "auto";

      const fullWidth = element.scrollWidth;
      const fullHeight = element.scrollHeight;

      const isZN = patch === "zn";

      const dpr = window.devicePixelRatio || 1;
      const BASE_SCALE = isZN ? 2 : 2.5;

      const MAX_SIDE = 8000;
      const ratio = Math.min(MAX_SIDE / fullWidth, MAX_SIDE / fullHeight, 1);

      const finalScale = Math.min(dpr * BASE_SCALE * ratio, 4);

      const canvas = await html2canvas(element, {
        scale: finalScale,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: fullWidth,
        height: fullHeight,
        windowWidth: fullWidth,
        windowHeight: fullHeight,
        scrollX: 0,
        scrollY: -window.scrollY,

        onclone: (doc) => {
          const inputs = doc.querySelectorAll("input");

          inputs.forEach((input) => {
            const el = input as HTMLInputElement;
            const computed = window.getComputedStyle(el);

            const div = doc.createElement("div");
            div.textContent = el.value;

            div.style.font = computed.font;
            div.style.fontSize = computed.fontSize;
            div.style.fontWeight = computed.fontWeight;
            div.style.textAlign = computed.textAlign;
            div.style.color = computed.color;
            div.style.padding = computed.padding;
            div.style.border = computed.border;
            div.style.width = computed.width;
            div.style.height = computed.height;
            div.style.background = computed.backgroundColor;
            div.style.boxSizing = "border-box";

            div.style.display = "flex";
            div.style.alignItems = "center";
            div.style.justifyContent =
              computed.textAlign === "center" ? "center" : "flex-start";

            el.parentNode?.replaceChild(div, el);
          });
        },
      });

      element.style.overflow = originalOverflow;
      element.style.height = originalHeight;

      if (!canvas) throw new Error("Canvas not created");

      // 🔥 Улучшаем сглаживание
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
      }

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/png", 1),
      );

      if (!blob) throw new Error("Failed to create image blob");

      const formData = new FormData();
      formData.append("file", blob, "screenshot.png");
      formData.append("caption", caption);

      await sendToTelegram(formData, patch);

      toast.success("График отправлен");
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Произошла ошибка");
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return patch === "zn" ? (
    <Button
      onClick={() => sendScreenshot()}
      disabled={disabled || isSending}
      className={cn(
        "cursor-pointer h-8 bg-bl text-white",
        disabled && "opacity-50",
        className,
      )}
    >
      send
    </Button>
  ) : (
    <button
      type="button"
      onClick={() => sendScreenshot()}
      disabled={disabled || isSending}
      className={cn("cursor-pointer", disabled && "opacity-50", className)}
    >
      <MailIcon className="h-5 w-5 hover:text-bl" strokeWidth={1.5} />
    </button>
  );
}
