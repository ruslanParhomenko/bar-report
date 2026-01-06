import { z } from "zod";
import { suppliers } from "./constants";

/* =========================
   Базовые схемы значений
   ========================= */

/** Пустая строка или число (для input) */
const numericStringSchema = z
  .string()
  .regex(/^\d*$/, "Only numbers")
  .default("");

/* =========================
   Схема одной строки поставщика
   ========================= */

const supplierRowSchema = z.object({
  /** Начальная сумма */
  start: numericStringSchema,

  /** Минус по дням */
  minus: z.array(numericStringSchema).default([]),

  /** Плюс по дням */
  plus: z.array(numericStringSchema).default([]),
});

/* =========================
   rowSuppliers (динамические ключи)
   ========================= */

const rowSuppliersShape = Object.fromEntries(
  suppliers.map((supplier) => [supplier, supplierRowSchema])
);

export const rowSuppliersSchema = z.object(rowSuppliersShape).strict();

/* =========================
   Default values для RHF
   ========================= */

const defaultRowSuppliers = Object.fromEntries(
  suppliers.map((supplier) => [
    supplier,
    {
      start: "",
      minus: [],
      plus: [],
    },
  ])
);

/* =========================
   Корневая схема формы
   ========================= */

export const suppliersSchema = z.object({
  year: z.string().default(new Date().getFullYear().toString()),

  month: z.string().default((new Date().getMonth() + 1).toString()),

  rowSuppliers: rowSuppliersSchema.default(defaultRowSuppliers),
});

/* =========================
   Типы
   ========================= */

export type RowSuppliersType = z.infer<typeof rowSuppliersSchema>;
export type SuppliersFormType = z.infer<typeof suppliersSchema>;

/* =========================
   Default form values
   ========================= */

export const defaultSuppliersForm = suppliersSchema.parse({});
