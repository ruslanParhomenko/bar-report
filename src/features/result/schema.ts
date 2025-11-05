import * as yup from 'yup'

export const resultSchema = yup.object({
    month : yup.string().required().default(''),
    year : yup.string().required().default(''),
    waitersDishBid : yup.string().required().default(''),
    barmenDishBid : yup.string().required().default(''),
    dishDishBid : yup.string().required().default(''),
    percentTips : yup.string().required().default(''),
})

export type ResultFormType = yup.InferType<typeof resultSchema>
export const resultDefaultValue = resultSchema.getDefault()