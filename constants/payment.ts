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
  [PAYMENT_STATUS.SUCCESS]: "bg-green-100 text-green-800",
  [PAYMENT_STATUS.FAILED]: "bg-red-100 text-red-800",
  [PAYMENT_STATUS.TIMEOUT]: "bg-amber-100 text-amber-800",
  [PAYMENT_STATUS.PROCESSING]: "bg-blue-100 text-blue-800",
  [PAYMENT_STATUS.IDLE]: "bg-gray-100 text-gray-800",
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
