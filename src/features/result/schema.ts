import * as yup from "yup";

export const resultHeaderSchema = yup.object({
  month: yup.string().required().default(""),
  year: yup.string().required().default(""),
  waitersDishBid: yup.string().required().default(""),
  barmenDishBid: yup.string().required().default(""),
  dishDishBid: yup.string().required().default(""),
  percentTips: yup.string().required().default(""),
  percentBarmen: yup.string().required().default(""),
  percentDish: yup.string().required().default(""),
});

export type ResultHeaderFormType = yup.InferType<typeof resultHeaderSchema>;
export const resultHeaderDefaultValue = resultHeaderSchema.getDefault();
