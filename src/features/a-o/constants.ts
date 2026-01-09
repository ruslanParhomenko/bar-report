import { arrayRowsType } from "./ao-render-row";

export const rowsAdvance = [
  {
    key: "advanceModaByDay",
    label: "advance-moda",
    colorBg: " bg-bl",
    colorText: " text-bl",
    type: "input",
  },
  {
    key: "advanceNBMByDay",
    label: "advance-nbm",
    colorBg: " bg-gr/75",
    colorText: " text-bl",
    type: "input",
  },
] satisfies arrayRowsType[];
export const rowsPurchaseModa = [
  {
    key: "purchaseModaByDay",
    label: "purchase-moda",
    colorBg: " bg-gr/75",
    colorText: " text-black",
    type: "input",
  },
  {
    key: "ttnModaByDay",
    label: "ttn-moda",
    colorBg: " bg-gr/20",
    colorText: " text-black",
    type: "input",
  },
  {
    key: "nameTtnModaByDay",
    label: "name-ttn-moda",
    colorBg: " bg-gr/20",
    colorText: " text-muted-foreground text-xs",
    type: "text",
  },
  {
    key: "purchaseBarByDay",
    label: "purchase-bar",
    colorBg: " bg-gr/20",
    colorText: " text-black",
    type: "input",
  },
  {
    key: "ttnBarByDay",
    label: "ttn-bar",
    colorBg: "",
    colorText: " text-black",
    type: "input",
  },
  {
    key: "nameTtnBarByDay",
    label: "name-ttn-bar",
    colorBg: " bg-gr/20",
    colorText: " text-muted-foreground text-xs",
    type: "text",
  },
] satisfies arrayRowsType[];

export const rowsPurchaseNMB = [
  {
    key: "fuelNBMByDay",
    label: "fuel-nbm",
    colorBg: " bg-gr/20",
    colorText: " text-gn",
    type: "input",
  },
  {
    key: "purchaseNBMByDay",
    label: "purchase-nbm",
    colorBg: " bg-gr/20",
    colorText: " text-gn",
    type: "input",
  },
  {
    key: "ttnNBMByDay",
    label: "ttn-nbm",
    colorBg: " bg-gr/20",
    colorText: " text-gn",
    type: "input",
  },
] satisfies arrayRowsType[];
