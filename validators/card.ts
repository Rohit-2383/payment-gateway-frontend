import { z } from "zod";

import { CARD_TYPES, CARD_NUMBER_LENGTHS, CVV_LENGTHS } from "@/constants/cards";
import { sanitizeCardNumber } from "@/utils/formatters";
import type { CardType } from "@/types/payment";

const ERROR_MESSAGES = {
  cardNumberRequired: "Card number is required.",
  cardNumberIncomplete: "Card number is incomplete.",
  cardNumberInvalid: "Card number is invalid.",
} as const;

export function getCardTypeFromCardNumber(digits: string): CardType {
  if (digits.startsWith("4")) return CARD_TYPES.VISA;
  if (digits.startsWith("34") || digits.startsWith("37")) return CARD_TYPES.AMEX;
  // Mastercard 51-55: need at least 2 digits to distinguish from 50/56-59
  if (digits.length >= 2) {
    const twoDigit = parseInt(digits.slice(0, 2), 10);
    if (twoDigit >= 51 && twoDigit <= 55) return CARD_TYPES.MASTERCARD;
  }
  // Mastercard 2-series 2221-2720: need at least 4 digits
  if (digits.length >= 4) {
    const fourDigit = parseInt(digits.slice(0, 4), 10);
    if (fourDigit >= 2221 && fourDigit <= 2720) return CARD_TYPES.MASTERCARD;
  }
  return CARD_TYPES.UNKNOWN;
}

export function getExpectedCardNumberLength(cardType: CardType): number {
  return CARD_NUMBER_LENGTHS[cardType];
}

export function getExpectedCvvLength(cardType: CardType): 3 | 4 {
  return CVV_LENGTHS[cardType];
}

export function isLuhnValid(digits: string): boolean {
  let sum = 0;
  let shouldDouble = false;

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    const char = digits[index];
    if (!char) return false;

    let digit = Number(char);
    if (!Number.isInteger(digit)) return false;

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

export const cardNumberSchema = z
  .string()
  .trim()
  .min(1, ERROR_MESSAGES.cardNumberRequired)
  .superRefine((value, ctx) => {
    const digits = sanitizeCardNumber(value);
    if (digits.length === 0) {
      ctx.addIssue({ code: "custom", message: ERROR_MESSAGES.cardNumberRequired });
      return;
    }

    const cardType = getCardTypeFromCardNumber(digits);
    const expectedLength = getExpectedCardNumberLength(cardType);

    if (digits.length < expectedLength) {
      ctx.addIssue({ code: "custom", message: ERROR_MESSAGES.cardNumberIncomplete });
      return;
    }

    if (digits.length > expectedLength) {
      ctx.addIssue({ code: "custom", message: ERROR_MESSAGES.cardNumberInvalid });
      return;
    }

    if (!isLuhnValid(digits)) {
      ctx.addIssue({ code: "custom", message: ERROR_MESSAGES.cardNumberInvalid });
    }
  });
