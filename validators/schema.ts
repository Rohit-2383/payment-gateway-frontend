import { z } from "zod";

import { CURRENCIES } from "@/constants/currencies";
import { sanitizeCardNumber } from "@/utils/formatters";
import type { Currency } from "@/types/payment";
import {
  cardNumberSchema,
  getCardTypeFromCardNumber,
  getExpectedCvvLength,
} from "@/validators/card";
import { expirySchema } from "@/validators/expiry";
import { cvvSchema } from "@/validators/cvv";
import { amountSchema } from "@/validators/amount";

const ERROR_MESSAGES = {
  cardholderNameRequired: "Cardholder name is required.",
  currencyRequired: "Currency is required.",
  cvvInvalidLength: "CVV length is invalid.",
} as const;

const cardholderNameSchema = z
  .string()
  .trim()
  .min(1, ERROR_MESSAGES.cardholderNameRequired);

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
