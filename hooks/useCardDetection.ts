"use client";

import { useMemo } from "react";

import { CVV_LENGTHS } from "@/constants/cards";
import { sanitizeCardNumber } from "@/utils/formatters";
import { getCardTypeFromCardNumber } from "@/validators/card";
import type { CardType } from "@/types/payment";

export function useCardDetection(cardNumber: string): {
  cardType: CardType;
  maxCVVLength: number;
} {
  return useMemo(() => {
    const digits = sanitizeCardNumber(cardNumber);
    const cardType = getCardTypeFromCardNumber(digits);
    const maxCVVLength = CVV_LENGTHS[cardType];

    return { cardType, maxCVVLength };
  }, [cardNumber]);
}
