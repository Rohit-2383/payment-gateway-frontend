import type { CardType } from "@/types/payment";

export const CARD_TYPES = {
  VISA: "visa",
  MASTERCARD: "mastercard",
  AMEX: "amex",
  UNKNOWN: "unknown",
} as const;

export const CARD_NUMBER_LENGTHS: Record<CardType, number> = {
  [CARD_TYPES.VISA]: 16,
  [CARD_TYPES.MASTERCARD]: 16,
  [CARD_TYPES.AMEX]: 15,
  [CARD_TYPES.UNKNOWN]: 16,
};

export const CVV_LENGTHS: Record<CardType, 3 | 4> = {
  [CARD_TYPES.VISA]: 3,
  [CARD_TYPES.MASTERCARD]: 3,
  [CARD_TYPES.AMEX]: 4,
  [CARD_TYPES.UNKNOWN]: 3,
};

export const CARD_TYPE_LABELS: Record<CardType, string> = {
  [CARD_TYPES.VISA]: "VISA",
  [CARD_TYPES.MASTERCARD]: "MASTERCARD",
  [CARD_TYPES.AMEX]: "AMEX",
  [CARD_TYPES.UNKNOWN]: "CARD",
};

export const CARD_PREVIEW_PLACEHOLDERS = {
  cardNumber: "•••• •••• •••• ••••",
  cardholderName: "CARDHOLDER NAME",
  expiry: "MM/YY",
} as const;
