import type { Currency } from "@/types/payment";

export const CURRENCIES = {
  INR: "INR",
  USD: "USD",
} as const;

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  [CURRENCIES.INR]: "₹",
  [CURRENCIES.USD]: "$",
};
