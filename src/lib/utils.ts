import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFormIdFromPathname(pathname: string): string {
  const mainRoute = pathname.split("/")[1] || "";
  return `${mainRoute}-form`;
}
