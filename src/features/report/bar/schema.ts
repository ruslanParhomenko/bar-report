import { z } from "zod";
import { INVENTORY_DATA, LIST_TOBACCO } from "./constants";
import { remarksSchema } from "@/features/penalty/schema";
import { breakSchema } from "@/features/break/schema";
import BreakForm from "@/features/break/break-form";

// products transfer
export const productTransferSchema = z.object({
  name: z.string().default(""),
  quantity: z.string().default(""),
  destination: z.string().default(""),
  time: z.string().default(""),
});

export type ProductTransferSchemaType = z.infer<typeof productTransferSchema>;

export const productTransferDefault = Array.from({ length: 8 }, () =>
  productTransferSchema.parse({}),
);

// inventory
export const inventorySchema = z.object({
  name: z.string().default(""),
  quantity: z.string().default(""),
  time: z.string().default(""),
});

export type InventorySchemaType = z.infer<typeof inventorySchema>;

export const inventoryDefault = INVENTORY_DATA.map((item) => ({
  ...inventorySchema.parse({}),
  name: item,
}));

// expenses
export const expenseSchema = z.object({
  name: z.string().default(""),
  sum: z.string().default(""),
  time: z.string().default(""),
});

export type ExpensesSchemaType = z.infer<typeof expenseSchema>;

export const expensesDefault = Array.from({ length: 8 }, () =>
  expenseSchema.parse({}),
);

// tobacco
export const tobaccoSchema = z.object({
  name: z.enum(LIST_TOBACCO),
  stock: z.number().default(0),
  incoming: z.string().default(""),
  outgoing: z.string().default(""),
  finalStock: z.number().default(0),
});

export type TobaccoSchemaType = z.infer<typeof tobaccoSchema>;

export const defaultTobaccoValue = LIST_TOBACCO.map((name) => ({
  name,
  stock: 0,
  incoming: "",
  outgoing: "",
  finalStock: 0,
}));
// cash verify
export const cashVerifySchema = z.object({
  hours: z.string().default(""),
  value: z.string().default(""),
});

export type CashVerifySchemaType = z.infer<typeof cashVerifySchema>;

export const cashVerifyDefault = Array.from({ length: 24 }, () =>
  cashVerifySchema.parse({}),
);

// report bar
export const reportBarSchema = z.object({
  date: z.coerce.date().default(new Date()),

  expenses: z.array(expenseSchema).default(expensesDefault),
  tobacco: z.array(tobaccoSchema).default(defaultTobaccoValue),
  cashVerify: z.array(cashVerifySchema).default(cashVerifyDefault),
  productTransfer: z
    .array(productTransferSchema)
    .default(productTransferDefault),
  inventory: z.array(inventorySchema).default(inventoryDefault),
  notes: z.string().nullable().default(""),
});

export type ReportBarFormValues = z.infer<typeof reportBarSchema>;

export const defaultValuesReportBar: ReportBarFormValues = {
  date: new Date(),
  expenses: expensesDefault,
  tobacco: defaultTobaccoValue,
  cashVerify: cashVerifyDefault,
  productTransfer: productTransferDefault,
  inventory: inventoryDefault,
  notes: "",
};

export const barSchema = z.object({
  report: reportBarSchema,
  penalty: remarksSchema,
  breakForm: breakSchema,
});
