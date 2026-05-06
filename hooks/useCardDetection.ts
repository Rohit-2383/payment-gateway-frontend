"use client";

import { useMemo } from "react";

import { CARD_TYPES } from "@/utils/constants";
import { sanitizeCardNumber } from "@/utils/formatters";
import type { CardType } from "@/types/payment";

const CVV_LENGTH_DEFAULT = 3;
const CVV_LENGTH_AMEX = 4;

function detectCardTypeFromDigits(digits: string): CardType {
  if (digits.startsWith("4")) return CARD_TYPES.VISA;
  if (digits.startsWith("5")) return CARD_TYPES.MASTERCARD;
  if (digits.startsWith("34") || digits.startsWith("37")) return CARD_TYPES.AMEX;
  return CARD_TYPES.UNKNOWN;
}

export function useCardDetection(cardNumber: string): {
  cardType: CardType;
  maxCVVLength: number;
} {
  return useMemo(() => {
    const digits = sanitizeCardNumber(cardNumber);
    const cardType = detectCardTypeFromDigits(digits);
    const maxCVVLength =
      cardType === CARD_TYPES.AMEX ? CVV_LENGTH_AMEX : CVV_LENGTH_DEFAULT;

    return { cardType, maxCVVLength };
  }, [cardNumber]);
}
