import { z } from "zod";

export const stopListItemSchema = z.object({
  product: z.string(),
  date: z.string(),
  autor: z.string(),
});

export type StopListItemSchemaType = z.infer<typeof stopListItemSchema>;

export const defaultStopList = {
  product: "",
  date: "",
  autor: "",
};

export const stopListSchema = z.object({
  stopList: z.array(stopListItemSchema),
});

export type StopListSchemaType = z.infer<typeof stopListSchema>;

export const defaultStopListSchema = {
  stopList: [defaultStopList],
};
