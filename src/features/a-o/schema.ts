import { z } from "zod";

const dayValueSchema = z.string();

export const rowAOSchema = z.array(dayValueSchema);
export const aoSchema = z.object({
  rowAOData: z.record(z.string(), rowAOSchema),
});

export type AoForm = z.infer<typeof aoSchema>;
