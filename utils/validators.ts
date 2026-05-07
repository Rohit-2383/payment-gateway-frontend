import { z } from "zod";

import { CARD_TYPES } from "@/constants/cards";
import { CURRENCIES } from "@/constants/currencies";
import { sanitizeCardNumber } from "@/utils/formatters";
import type { CardType, Currency } from "@/types/payment";

const ERROR_MESSAGES = {
  cardholderNameRequired: "Cardholder name is required.",
  cardNumberRequired: "Card number is required.",
  cardNumberIncomplete: "Card number is incomplete.",
  cardNumberInvalid: "Card number is invalid.",
  expiryRequired: "Expiry is required.",
  expiryIncomplete: "Expiry is incomplete.",
  expiryInvalid: "Expiry must be a valid MM/YY.",
  expiryPast: "Expiry must not be in the past.",
  cvvRequired: "CVV is required.",
  cvvDigitsOnly: "CVV must contain only digits.",
  cvvInvalidLength: "CVV length is invalid.",
  amountRequired: "Amount is required.",
  amountInvalid: "Amount must be a valid number.",
  amountPositive: "Amount must be greater than 0.",
  currencyRequired: "Currency is required.",
} as const;

export function getCardTypeFromCardNumber(digits: string): CardType {
  if (digits.startsWith("4")) return CARD_TYPES.VISA;
  if (digits.startsWith("5")) return CARD_TYPES.MASTERCARD;
  if (digits.startsWith("34") || digits.startsWith("37")) return CARD_TYPES.AMEX;
  return CARD_TYPES.UNKNOWN;
}

export function getExpectedCardNumberLength(cardType: CardType): number {
  if (cardType === CARD_TYPES.AMEX) return 15;
  return 16;
}

export function getExpectedCvvLength(cardType: CardType): 3 | 4 {
  if (cardType === CARD_TYPES.AMEX) return 4;
  return 3;
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

export function parseExpiryToMonthYear(
  expiry: string
): { month: number; year: number } | null {
  const digits = expiry.replaceAll(/\D/g, "");
  if (digits.length !== 4) return null;

  const month = Number(digits.slice(0, 2));
  const yearTwoDigits = Number(digits.slice(2, 4));

  if (!Number.isInteger(month) || month < 1 || month > 12) return null;
  if (!Number.isInteger(yearTwoDigits) || yearTwoDigits < 0 || yearTwoDigits > 99)
    return null;

  const year = 2000 + yearTwoDigits;
  return { month, year };
}

export function isExpiryNotInPast(month: number, year: number): boolean {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year > currentYear) return true;
  if (year < currentYear) return false;
  return month >= currentMonth;
}

function getCurrencyEnum() {
  const values = Object.values(CURRENCIES);
  if (values.length === 0) {
    return z.enum([""] as [string, ...string[]], {
      message: ERROR_MESSAGES.currencyRequired,
    });
  }
  return z.enum(values as [string, ...string[]], {
    message: ERROR_MESSAGES.currencyRequired,
  });
}

function isValidAmountString(value: string): boolean {
  const normalized = value.trim();
  if (normalized.length === 0) return false;
  return /^\d+(\.\d{0,2})?$/.test(normalized);
}

const cardholderNameSchema = z
  .string()
  .trim()
  .min(1, ERROR_MESSAGES.cardholderNameRequired);

const cardNumberSchema = z
  .string()
  .trim()
  .min(1, ERROR_MESSAGES.cardNumberRequired)
  .superRefine((value, ctx) => {
    const digits = sanitizeCardNumber(value);
    if (digits.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: ERROR_MESSAGES.cardNumberRequired,
      });
      return;
    }

    const cardType = getCardTypeFromCardNumber(digits);
    const expectedLength = getExpectedCardNumberLength(cardType);

    if (digits.length < expectedLength) {
      ctx.addIssue({
        code: "custom",
        message: ERROR_MESSAGES.cardNumberIncomplete,
      });
      return;
    }

    if (digits.length > expectedLength) {
      ctx.addIssue({
        code: "custom",
        message: ERROR_MESSAGES.cardNumberInvalid,
      });
      return;
    }

    if (!isLuhnValid(digits)) {
      ctx.addIssue({
        code: "custom",
        message: ERROR_MESSAGES.cardNumberInvalid,
      });
    }
  });

const expirySchema = z
  .string()
  .trim()
  .min(1, ERROR_MESSAGES.expiryRequired)
  .superRefine((value, ctx) => {
    const digits = value.replaceAll(/\D/g, "");
    if (digits.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: ERROR_MESSAGES.expiryRequired,
      });
      return;
    }

    if (digits.length !== 4) {
      ctx.addIssue({
        code: "custom",
        message: ERROR_MESSAGES.expiryIncomplete,
      });
      return;
    }

    const parsed = parseExpiryToMonthYear(value);
    if (!parsed) {
      ctx.addIssue({
        code: "custom",
        message: ERROR_MESSAGES.expiryInvalid,
      });
      return;
    }

    if (!isExpiryNotInPast(parsed.month, parsed.year)) {
      ctx.addIssue({
        code: "custom",
        message: ERROR_MESSAGES.expiryPast,
      });
    }
  });

const cvvSchema = z
  .string()
  .trim()
  .min(1, ERROR_MESSAGES.cvvRequired)
  .superRefine((value, ctx) => {
    const digits = value.replaceAll(/\D/g, "");
    if (digits.length === 0) {
      ctx.addIssue({ code: "custom", message: ERROR_MESSAGES.cvvRequired });
      return;
    }
    if (digits.length !== value.length) {
      ctx.addIssue({ code: "custom", message: ERROR_MESSAGES.cvvDigitsOnly });
      return;
    }
    if (digits.length < 3 || digits.length > 4) {
      ctx.addIssue({
        code: "custom",
        message: ERROR_MESSAGES.cvvInvalidLength,
      });
    }
  });

const amountSchema = z
  .string()
  .trim()
  .min(1, ERROR_MESSAGES.amountRequired)
  .superRefine((value, ctx) => {
    if (!isValidAmountString(value)) {
      ctx.addIssue({ code: "custom", message: ERROR_MESSAGES.amountInvalid });
      return;
    }
    const amount = Number(value);
    if (!Number.isFinite(amount)) {
      ctx.addIssue({ code: "custom", message: ERROR_MESSAGES.amountInvalid });
      return;
    }
    if (amount <= 0) {
      ctx.addIssue({ code: "custom", message: ERROR_MESSAGES.amountPositive });
    }
  })
  .transform((value) => Number(value) as number);

const currencySchema = getCurrencyEnum().transform((value) => value as Currency);

export const paymentFormSchema = z
  .object({
    cardholderName: cardholderNameSchema,
    cardNumber: cardNumberSchema,
    expiry: expirySchema,
    cvv: cvvSchema,
    amount: amountSchema,
    currency: currencySchema,
  })
  .superRefine((data, ctx) => {
    const cardNumberDigits = sanitizeCardNumber(data.cardNumber);
    const cardType = getCardTypeFromCardNumber(cardNumberDigits);
    const expectedCvvLength = getExpectedCvvLength(cardType);

    const cvvDigits = data.cvv.replaceAll(/\D/g, "");
    if (cvvDigits.length === 0) return;

    if (cvvDigits.length !== expectedCvvLength) {
      ctx.addIssue({
        code: "custom",
        path: ["cvv"],
        message: ERROR_MESSAGES.cvvInvalidLength,
      });
    }
  });

export type PaymentFormInputValues = z.input<typeof paymentFormSchema>;
export type PaymentFormValues = z.output<typeof paymentFormSchema>;
