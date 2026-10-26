import type { Metadata, Viewport } from "next";
import { Lora } from "next/font/google";

export const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["500", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bar App",
  description: "Report schedule and orders",
  applicationName: "Bar App",

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bar App",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};
