import { arrayRowsType } from "./ao-render-row";

export const NAME_TTN = [
  "metro",
  "iutam",
  "armas",
  "n-1",
  "yamato",
  "macelar",
  "other",
];
export const rowsAdvance = [
  {
    key: "advanceModaByDay",
    label: "advance-moda",
    colorBg: " bg-bl",
    colorText: " text-bl",
    data: null,
  },
  {
    key: "advanceNBMByDay",
    label: "advance-nbm",
    colorBg: " bg-gr/75",
    colorText: " text-bl",
    data: null,
  },
] satisfies arrayRowsType[];
export const rowsPurchaseModa = [
  {
    key: "purchaseModaByDay",
    label: "purchase-moda",
    colorBg: " bg-gr/75",
    colorText: " text-black",
    data: null,
  },
  {
    key: "ttnModaByDay",
    label: "ttn-moda",
    colorBg: " bg-gr/20",
    colorText: " text-black",
    data: null,
  },
  {
    key: "nameTtnModaByDay",
    label: "name-ttn-moda",
    colorBg: " bg-gr/20",
    colorText: " text-muted-foreground text-xs",
    data: NAME_TTN,
  },
  {
    key: "purchaseBarByDay",
    label: "purchase-bar",
    colorBg: " bg-gr/20",
    colorText: " text-black",
    data: null,
  },
  {
    key: "ttnBarByDay",
    label: "ttn-bar",
    colorBg: "",
    colorText: " text-black",
    data: null,
  },
  {
    key: "nameTtnBarByDay",
    label: "name-ttn-bar",
    colorBg: " bg-gr/20",
    colorText: " text-muted-foreground text-xs",
    data: NAME_TTN,
  },
] satisfies arrayRowsType[];

export const rowsPurchaseNMB = [
  {
    key: "fuelNBMByDay",
    label: "fuel-nbm",
    colorBg: " bg-gr/20",
    colorText: " text-gn",
    data: null,
  },
  {
    key: "purchaseNBMByDay",
    label: "purchase-nbm",
    colorBg: " bg-gr/20",
    colorText: " text-gn",
    data: null,
  },
  {
    key: "ttnNBMByDay",
    label: "ttn-nbm",
    colorBg: " bg-gr/20",
    colorText: " text-gn",
    data: null,
  },
] satisfies arrayRowsType[];
