import {
  ACVAMONT,
  ACVILIN,
  APIFERA,
  AQUATRADE,
  ARTACULINAR,
  BAKERY,
  BLUESHARK,
  BUCURIA,
  BUISNESS,
  CHOCO,
  COCACOLA,
  DAVIDAN,
  DELPHI,
  DINOVA,
  ETALONUS,
  FORWARD,
  FORWARD_CUCINE,
  FRUITBOX,
  FRUITBOX_C,
  FRUITS,
  FRUITS_CUISINE,
  GLOBARSPIRIT,
  GREEN,
  GROCERIES,
  CHEMICALS,
  IMCOMVIL,
  IUG,
  MEAT,
  MILK,
  MISCELLANEOUS,
  NUTS,
  OFFICE,
  OTHER,
  PHARMACEUTICAL,
  PRESTAPAC,
  ROGOB,
  SPICES,
  SPICES_2,
  UBFB,
  UBFB2,
  VEGETABLES,
  VERGNANO,
  VITAFOR,
  SAMPAREX,
} from "./constants";

type FieldNameBar =
  | (typeof FRUITS)[number]
  | (typeof GROCERIES)[number]
  | (typeof CHEMICALS)[number]
  | (typeof MISCELLANEOUS)[number]
  | (typeof OFFICE)[number]
  | (typeof PHARMACEUTICAL)[number]
  | (typeof NUTS)[number]
  | (typeof SPICES)[number]
  | (typeof SPICES_2)[number]
  | (typeof VEGETABLES)[number]
  | (typeof GREEN)[number]
  | (typeof FRUITS_CUISINE)[number]
  | (typeof MEAT)[number]
  | (typeof MILK)[number]
  | (typeof OTHER)[number]
  | (typeof SAMPAREX)[number];
export type OrderListBarFormValues = {
  [key in FieldNameBar]?: string;
};

// default values bar

const allFieldsBar = [
  ...FRUITS,
  ...GROCERIES,
  ...CHEMICALS,
  ...MISCELLANEOUS,
  ...OFFICE,
  ...PHARMACEUTICAL,
  ...NUTS,
  ...SPICES,
  ...SPICES_2,
  ...VEGETABLES,
  ...GREEN,
  ...FRUITS_CUISINE,
  ...MEAT,
  ...MILK,
  ...OTHER,
  ...SAMPAREX,
];

export const defaultValuesZNBar = Object.fromEntries(
  allFieldsBar.map((field) => [field, ""])
) as OrderListBarFormValues;

// default values cucina

const allFieldsCucina = [
  ...NUTS,
  ...SPICES,
  ...SPICES_2,
  ...VEGETABLES,
  ...GREEN,
  ...FRUITS_CUISINE,
  ...MEAT,
  ...MILK,
  ...OTHER,
  ...BAKERY,
];

export const defaultValuesZNCucina = Object.fromEntries(
  allFieldsCucina.map((field) => [field, ""])
) as OrderListBarFormValues;

type FieldNameCucina =
  | (typeof AQUATRADE)[number]
  | (typeof BUCURIA)[number]
  | (typeof COCACOLA)[number]
  | (typeof FORWARD)[number]
  | (typeof GLOBARSPIRIT)[number]
  | (typeof ACVILIN)[number]
  | (typeof ACVAMONT)[number]
  | (typeof VERGNANO)[number]
  | (typeof CHOCO)[number]
  | (typeof FRUITBOX)[number]
  | (typeof APIFERA)[number]
  | (typeof DAVIDAN)[number]
  | (typeof ROGOB)[number]
  | (typeof BLUESHARK)[number]
  | (typeof FRUITBOX_C)[number]
  | (typeof DINOVA)[number]
  | (typeof FORWARD_CUCINE)[number]
  | (typeof PRESTAPAC)[number]
  | (typeof IMCOMVIL)[number]
  | (typeof ARTACULINAR)[number]
  | (typeof ETALONUS)[number]
  | (typeof VITAFOR)[number]
  | (typeof DELPHI)[number]
  | (typeof IUG)[number]
  | (typeof UBFB)[number]
  | (typeof UBFB2)[number];

export type OrderListTTNFormValues = {
  [key in FieldNameCucina]?: string;
};

//default data cucine

const allFieldsCucinaTTN = [
  ...ROGOB,
  ...BLUESHARK,
  ...FRUITBOX_C,
  ...DINOVA,
  ...IUG,
  ...PRESTAPAC,
  ...IMCOMVIL,
  ...ARTACULINAR,
  ...ETALONUS,
  ...VITAFOR,
  ...FORWARD_CUCINE,
  ...DELPHI,
  ...PRESTAPAC,
  ...IMCOMVIL,
  ...ETALONUS,
];
export const defaultEmptyValuesCucina = Object.fromEntries(
  allFieldsCucinaTTN.map((field) => [field, ""])
) as OrderListTTNFormValues;

//default data bar

const allFieldsBarTTN = [
  ...AQUATRADE,
  ...BUCURIA,
  ...COCACOLA,
  ...DAVIDAN,
  ...FORWARD,
  ...FRUITBOX,
  ...GLOBARSPIRIT,
  ...VERGNANO,
  ...CHOCO,
  ...APIFERA,
  ...UBFB,
  ...BUISNESS,
  ...ACVAMONT,
  ...ACVILIN,
  ...UBFB2,
  ...SAMPAREX,
];

export const defaultEmptyValuesBar = Object.fromEntries(
  allFieldsBarTTN.map((field) => [field, ""])
) as OrderListTTNFormValues;

//

type FieldName =
  // TTN
  | (typeof AQUATRADE)[number]
  | (typeof BUCURIA)[number]
  | (typeof COCACOLA)[number]
  | (typeof FORWARD)[number]
  | (typeof GLOBARSPIRIT)[number]
  | (typeof ACVILIN)[number]
  | (typeof ACVAMONT)[number]
  | (typeof VERGNANO)[number]
  | (typeof CHOCO)[number]
  | (typeof FRUITBOX)[number]
  | (typeof APIFERA)[number]
  | (typeof DAVIDAN)[number]
  | (typeof ROGOB)[number]
  | (typeof BLUESHARK)[number]
  | (typeof FRUITBOX_C)[number]
  | (typeof DINOVA)[number]
  | (typeof FORWARD_CUCINE)[number]
  | (typeof PRESTAPAC)[number]
  | (typeof IMCOMVIL)[number]
  | (typeof ARTACULINAR)[number]
  | (typeof ETALONUS)[number]
  | (typeof VITAFOR)[number]
  | (typeof DELPHI)[number]
  | (typeof IUG)[number]
  | (typeof UBFB)[number]
  | (typeof UBFB2)[number]
  // BAR
  | (typeof FRUITS)[number]
  | (typeof GROCERIES)[number]
  | (typeof CHEMICALS)[number]
  | (typeof MISCELLANEOUS)[number]
  | (typeof OFFICE)[number]
  | (typeof PHARMACEUTICAL)[number]
  | (typeof NUTS)[number]
  | (typeof SPICES)[number]
  | (typeof SPICES_2)[number]
  | (typeof VEGETABLES)[number]
  | (typeof GREEN)[number]
  | (typeof FRUITS_CUISINE)[number]
  | (typeof MEAT)[number]
  | (typeof MILK)[number]
  | (typeof OTHER)[number];

export type OrderListFormType = {
  [key in FieldName]?: string;
};
