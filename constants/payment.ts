import type { PaymentStatus } from "@/types/payment";

export const PAYMENT_STATUS = {
  IDLE: "idle",
  PROCESSING: "processing",
  SUCCESS: "success",
  FAILED: "failed",
  TIMEOUT: "timeout",
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

export const TRANSACTION_STATUS_CLASSES: Record<PaymentStatus, string> = {
  [PAYMENT_STATUS.SUCCESS]: "bg-success-subtle text-success-fg",
  [PAYMENT_STATUS.FAILED]: "bg-danger-subtle text-danger-fg",
  [PAYMENT_STATUS.TIMEOUT]: "bg-warning-subtle text-warning-fg",
  [PAYMENT_STATUS.PROCESSING]: "bg-brand-subtle text-brand",
  [PAYMENT_STATUS.IDLE]: "bg-muted text-muted-foreground",
};

export const REASON_VISIBLE_STATUSES: ReadonlySet<PaymentStatus> = new Set([
  PAYMENT_STATUS.FAILED,
  PAYMENT_STATUS.TIMEOUT,
]);

export const TERMINAL_STATUSES: ReadonlySet<PaymentStatus> = new Set([
  PAYMENT_STATUS.SUCCESS,
  PAYMENT_STATUS.FAILED,
  PAYMENT_STATUS.TIMEOUT,
]);

export const STATUS_LABELS: Record<PaymentStatus, string> = {
  [PAYMENT_STATUS.IDLE]: "Idle",
  [PAYMENT_STATUS.PROCESSING]: "Processing",
  [PAYMENT_STATUS.SUCCESS]: "Success",
  [PAYMENT_STATUS.FAILED]: "Failed",
  [PAYMENT_STATUS.TIMEOUT]: "Timeout",
};

export const MAX_ATTEMPTS_MESSAGE =
  "Maximum retry attempts reached. Please contact support or try a different card.";

export const NETWORK_ERROR_MESSAGE =
  "Unable to reach payment server. Check your connection.";

export const TIMEOUT_ERROR_MESSAGE = "Request took too long. Please try again.";

export const UI_TEXT = {
  title: "Payment Gateway",
  subtitle: "Production-quality payment form",
  leftTitle: "Payment details",
  leftDescription: "Real-time validation, formatting, and card detection.",
} as const;

