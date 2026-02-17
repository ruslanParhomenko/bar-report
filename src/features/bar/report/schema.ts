import { z } from "zod";
import { INVENTORY_DATA, LIST_TOBACCO } from "./constants";

// products transfer
export const productTransferSchema = z.object({
  name: z.string(),
  quantity: z.string(),
  destination: z.string(),
  time: z.string(),
});

export type ProductTransferSchemaType = z.infer<typeof productTransferSchema>;

export const productTransferDefault = Array.from({ length: 8 }, () => ({
  name: "",
  quantity: "",
  destination: "",
  time: "",
}));

// inventory
export const inventorySchema = z.object({
  name: z.string(),
  quantity: z.string(),
  time: z.string(),
});

export type InventorySchemaType = z.infer<typeof inventorySchema>;

export const inventoryDefault = INVENTORY_DATA.map((item) => ({
  name: item,
  quantity: "",
  time: "",
}));

// expenses
export const expenseSchema = z.object({
  name: z.string(),
  sum: z.string(),
  time: z.string(),
});

export type ExpensesSchemaType = z.infer<typeof expenseSchema>;

export const expensesDefault = Array.from({ length: 8 }, () => ({
  name: "",
  sum: "",
  time: "",
}));

// tobacco
export const tobaccoSchema = z.object({
  name: z.enum(LIST_TOBACCO),
  stock: z.number(),
  incoming: z.string(),
  outgoing: z.string(),
  finalStock: z.number(),
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
  hours: z.string(),
  value: z.string(),
});

export type CashVerifySchemaType = z.infer<typeof cashVerifySchema>;
export const cashVerifyDefault = Array.from({ length: 24 }, () => ({
  hours: "",
  value: "",
}));

// report bar
export const reportBarSchema = z.object({
  expenses: z.array(expenseSchema),
  tobacco: z.array(tobaccoSchema),
  cashVerify: z.array(cashVerifySchema),
  productTransfer: z.array(productTransferSchema),
  inventory: z.array(inventorySchema),
  notes: z.string(),
});

export type ReportBarFormValues = z.infer<typeof reportBarSchema>;

export const defaultValuesReportBar = {
  expenses: expensesDefault,
  tobacco: defaultTobaccoValue,
  cashVerify: cashVerifyDefault,
  productTransfer: productTransferDefault,
  inventory: inventoryDefault,
  notes: "",
};
