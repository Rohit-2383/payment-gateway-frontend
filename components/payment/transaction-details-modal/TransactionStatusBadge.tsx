import { TRANSACTION_STATUS_CLASSES } from "@/constants/payment";
import { cn } from "@/lib/utils";
import type { PaymentStatus } from "@/types/payment";

interface TransactionStatusBadgeProps {
  status: PaymentStatus;
}

export function TransactionStatusBadge({ status }: TransactionStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        TRANSACTION_STATUS_CLASSES[status]
      )}
    >
      {status}
    </span>
  );
}
