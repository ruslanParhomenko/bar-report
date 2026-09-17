"use client";

import QRCode from "qrcode";
import { useEffect, useRef } from "react";

export function QrCode({ value }: { value: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !value) {
      return;
    }

    QRCode.toCanvas(canvasRef.current, value, {
      width: 56,
      margin: 1,
      color: {
        dark: "#b4b4b4",
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    });
  }, [value]);

  return (
    <canvas
      ref={canvasRef}
      width={56}
      height={56}
      className="h-14 w-14 shrink-0"
    />
  );
}
