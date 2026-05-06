import { PaymentStatus } from "@/types/payment";

export const TRANSACTION_STATUS_CLASSES: Record<PaymentStatus, string> = {
  success: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  timeout: "bg-amber-100 text-amber-800",
  processing: "bg-blue-100 text-blue-800",
  idle: "bg-gray-100 text-gray-800",
};
