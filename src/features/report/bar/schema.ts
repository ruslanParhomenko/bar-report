import * as yup from "yup";
import { INVENTORY_DATA, LIST_TOBACCO } from "./constants";

//products transfer
export const productTransferSchema = yup.object().shape({
  name: yup.string().default(""),
  quantity: yup.string().default(""),
  destination: yup.string().default(""),
  time: yup.string().default(""),
});

export type ProductTransferSchemaType = yup.InferType<
  typeof productTransferSchema
>;
export const productTransferDefault = Array.from({ length: 8 }, () =>
  productTransferSchema.getDefault()
);

// inventory
export const inventorySchema = yup.object().shape({
  name: yup.string().default(""),
  quantity: yup.string().default(""),
  time: yup.string().default(""),
});

export type InventorySchemaType = yup.InferType<typeof inventorySchema>;
export const inventoryDefault = INVENTORY_DATA.map((item) => ({
  ...inventorySchema.getDefault(),
  name: item,
}));

//expenses
export const expenseSchema = yup.object().shape({
  name: yup.string().default(""),
  sum: yup.string().default(""),
  time: yup.string().default(""),
});

export type ExpensesSchemaType = yup.InferType<typeof expenseSchema>;
export const expensesDefault = Array.from({ length: 8 }, () =>
  expenseSchema.getDefault()
);

//tobacco

export const tobaccoSchema = yup.object().shape({
  name: yup
    .string()
    .default("")
    .oneOf(LIST_TOBACCO, "Name must be one of the predefined list"),
  stock: yup.number().default(0),
  incoming: yup.string().default(""),
  outgoing: yup.string().default(""),
  finalStock: yup.number().default(0),
});

export type TobaccoSchemaType = yup.InferType<typeof tobaccoSchema>;
export const defaultTobaccoValue = LIST_TOBACCO.map((name) => ({
  ...tobaccoSchema.getDefault(),
  name: name,
}));

// cash verify
export const cashVerifySchema = yup.object().shape({
  hours: yup.string().default(""),
  value: yup.string().default(""),
});

export type CashVerifySchemaType = yup.InferType<typeof cashVerifySchema>;
export const cashVerifyDefault = Array.from({ length: 24 }, () =>
  cashVerifySchema.getDefault()
);

//report bar
export const reportBarSchema = yup.object().shape({
  date: yup.date().default(new Date()),
  expenses: yup.array(expenseSchema).default(expensesDefault),
  tobacco: yup.array(tobaccoSchema).default(defaultTobaccoValue),
  cashVerify: yup.array(cashVerifySchema).default(cashVerifyDefault),
  productTransfer: yup
    .array(productTransferSchema)
    .default(productTransferDefault),
  inventory: yup.array(inventorySchema).default(inventoryDefault),
  notes: yup.string().nullable().default(""),
});

export type ReportBarFormValues = yup.InferType<typeof reportBarSchema>;
export const defaultValuesReportBar = {
  date: new Date(),
  expenses: expensesDefault,
  tobacco: defaultTobaccoValue,
  cashVerify: cashVerifyDefault,
  productTransfer: productTransferDefault,
  inventory: inventoryDefault,
  notes: "",
};
