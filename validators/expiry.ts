import { z } from "zod";

const ERROR_MESSAGES = {
  expiryRequired: "Expiry is required.",
  expiryIncomplete: "Expiry is incomplete.",
  expiryInvalid: "Expiry must be a valid MM/YY.",
  expiryPast: "Expiry must not be in the past.",
} as const;

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

export const expirySchema = z
  .string()
  .trim()
  .min(1, ERROR_MESSAGES.expiryRequired)
  .superRefine((value, ctx) => {
    const digits = value.replaceAll(/\D/g, "");
    if (digits.length === 0) {
      ctx.addIssue({ code: "custom", message: ERROR_MESSAGES.expiryRequired });
      return;
    }

    if (digits.length !== 4) {
      ctx.addIssue({ code: "custom", message: ERROR_MESSAGES.expiryIncomplete });
      return;
    }

    const parsed = parseExpiryToMonthYear(value);
    if (!parsed) {
      ctx.addIssue({ code: "custom", message: ERROR_MESSAGES.expiryInvalid });
      return;
    }

    if (!isExpiryNotInPast(parsed.month, parsed.year)) {
      ctx.addIssue({ code: "custom", message: ERROR_MESSAGES.expiryPast });
    }
  });
