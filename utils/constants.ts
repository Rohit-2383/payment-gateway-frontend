export const PAYMENT_STATUS = {
  IDLE: "idle",
  PROCESSING: "processing",
  SUCCESS: "success",
  FAILED: "failed",
  TIMEOUT: "timeout",
} as const;

export const CARD_TYPES = {
  VISA: "visa",
  MASTERCARD: "mastercard",
  AMEX: "amex",
  UNKNOWN: "unknown",
} as const;

export const CURRENCIES = {
  INR: "INR",
  USD: "USD",
} as const;

export const FAILURE_REASONS = [
  "Insufficient funds",
  "Card declined",
  "Bank rejected transaction",
  "Payment authorization failed",
] as const;


export const MAX_RETRY_ATTEMPTS = 3;

export const PAYMENT_TIMEOUT_MS = 6000;

export const PROCESSING_DELAY_MS = 2000;