import { CashItem } from "@/features/cash-month/ui/view-mode/cash-body-view";

export const ROW_CASH_DATA = [
  {
    key: "cashBarByDay",
    label: "cash-1c",
    colorText: " text-gr/50",
    section: "1c",
  },
  {
    key: "cashBarByDayBuffet",
    label: "cash-1c-buffet",
    colorText: " text-gr/50",
    section: "1c",
  },

  {
    key: "banquetBarByDay",
    label: "banquet",
    colorText: " text-gr/50",
    section: "1c",
  },
  {
    key: "visaCasinoBarByDay",
    label: "visa-c-b",
    colorText: " text-gr/50",
    section: "1c",
  },
  {
    key: "cash",
    label: "cash",
    colorText: " text-gn",
    section: "cash",
  },
  {
    key: "visaBarByDay",
    label: "visa",
    colorText: " text-gn",
    section: "visa",
  },
  {
    key: "visaTerminalByDay",
    label: "visa-terminal",
    colorText: " text-gr/50",
    section: "visa-terminal",
  },
  {
    key: "cashBuffet",
    label: "cash-buffet",
    colorText: " text-gn",
    section: "cash",
  },
  {
    key: "visaBarByDayBuffet",
    label: "visa-buffet",
    colorText: " text-gn",
    section: "visa",
  },
  {
    key: "visaTerminalByDayBuffet",
    label: "visa-terminal-buffet",
    colorText: " text-gr/50",
    section: "visa-terminal",
  },
  {
    key: "nbmPayByDay",
    label: "nbm-pay",
    colorText: " text-gr/50",
    section: "nbm",
  },
  {
    key: "bankCollectionByDay",
    label: "bank-coll",
    colorText: " text-bl",
    section: "coll",
  },
  {
    key: "bankCollectionByDayBuffet",
    label: "bank-coll-buffet",
    colorText: " text-bl",
    section: "coll",
  },

  {
    key: "nbmCollectionByDay",
    label: "nbm-coll",
    colorText: " text-bl",
    section: "coll",
  },
  {
    key: "nbmCollectionByDayBuffet",
    label: "nbm-coll-buffet",
    colorText: " text-bl",
    section: "coll",
  },
] as const satisfies CashItem[];
