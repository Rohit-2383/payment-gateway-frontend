import { z } from "zod";

import { getExpectedCvvLength } from "@/validators/card";

export { getExpectedCvvLength };

const ERROR_MESSAGES = {
  cvvRequired: "CVV is required.",
  cvvDigitsOnly: "CVV must contain only digits.",
  cvvInvalidLength: "CVV length is invalid.",
} as const;

export const cvvSchema = z
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
      ctx.addIssue({ code: "custom", message: ERROR_MESSAGES.cvvInvalidLength });
    }
  });
