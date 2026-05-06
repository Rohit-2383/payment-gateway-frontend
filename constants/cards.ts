import type { CardType } from "@/types/payment";
import { CARD_TYPES } from "@/utils/constants";

export { CARD_TYPES };

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
