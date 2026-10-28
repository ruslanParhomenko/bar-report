"use client";
import { format, isValid, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

export const formatNow = (): string => {
  const now = new Date();

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

export const formatNowData = (): string => {
  const now = new Date();

  const day = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  return `${day}.${month} ${hours}:${minutes}`;
};

export function formatShortDate(date: string | Date) {
  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);

  return `${day}.${month}.${year}`;
}

export function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;

  const date = parseISO(value);

  return isValid(date) ? date : null;
}

export function formatDate(value: string | null | undefined): string {
  const date = parseDate(value);

  return date ? format(date, "d MMM yyyy", { locale: ru }) : "—";
}
