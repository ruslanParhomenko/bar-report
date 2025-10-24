"use client";

import { useState } from "react";
import html2canvas from "html2canvas-pro";
import { toast } from "sonner";

export function useTelegramScreenshot<T extends HTMLElement>({
  ref,
  tagName,
}: {
  ref: React.RefObject<T>;
  tagName: string;
}) {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendScreenshot = async (caption = "") => {
    if (!ref.current) return;

    try {
      setIsSending(true);
      setError(null);

      const canvas = await html2canvas(ref.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/png")
      );
      if (!blob) throw new Error("Failed to create image blob");

      const formData = new FormData();
      formData.append("file", blob, "screenshot.png");
      formData.append("caption", caption);

      const res = await fetch(`/api/telegram/${tagName}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send Telegram message");
      }
      toast.success("График отправлен");

      return true;
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unknown error");
      toast.error("Произошла ошибка");
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return { sendScreenshot, isSending, error };
}
