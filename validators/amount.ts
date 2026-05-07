import { z } from "zod";

const ERROR_MESSAGES = {
  amountRequired: "Amount is required.",
  amountInvalid: "Amount must be a valid number.",
  amountPositive: "Amount must be greater than 0.",
} as const;

export function isValidAmountString(value: string): boolean {
  const normalized = value.trim();
  if (normalized.length === 0) return false;
  return /^\d+(\.\d{0,2})?$/.test(normalized);
}

export const amountSchema = z
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
