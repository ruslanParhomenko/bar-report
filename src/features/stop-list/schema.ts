import { z } from "zod";

export const stopListItemSchema = z.object({
  key: z.number(),
  product: z.string().default(""),
  date: z.string().default(""),
});

export type StopListItemSchemaType = z.infer<typeof stopListItemSchema>;

export const defaultStopList: StopListItemSchemaType = stopListItemSchema.parse(
  { key: 0 }
);

export const stopListSchema = z.object({
  stopList: z.array(stopListItemSchema).default([defaultStopList]),
});

export type StopListSchemaType = z.infer<typeof stopListSchema>;

export const defaultStopListSchema: StopListSchemaType = stopListSchema.parse(
  {}
);
