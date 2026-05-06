import { PAYMENT_STATUS, MAX_RETRY_ATTEMPTS } from "@/utils/constants";
import { PaymentStatus } from "@/types/payment";

export { PAYMENT_STATUS, MAX_RETRY_ATTEMPTS };

export const TRANSACTION_STATUS_CLASSES: Record<PaymentStatus, string> = {
  success: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  timeout: "bg-amber-100 text-amber-800",
  processing: "bg-blue-100 text-blue-800",
  idle: "bg-gray-100 text-gray-800",
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
  idle: "Idle",
  processing: "Processing",
  success: "Success",
  failed: "Failed",
  timeout: "Timeout",
};
