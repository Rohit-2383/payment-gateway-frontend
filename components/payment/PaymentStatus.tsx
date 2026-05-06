"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import type { PaymentStatus as PaymentStatusType, Transaction } from "@/types/payment";
import { PAYMENT_STATUS } from "@/utils/constants";

const UI_TEXT = {
  statusLabel: "Status",
  attemptsLabel: "Attempts",
} as const;

const STATUS_LABELS: Record<
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS],
  string
> = {
  [PAYMENT_STATUS.IDLE]: "Idle",
  [PAYMENT_STATUS.PROCESSING]: "Processing",
  [PAYMENT_STATUS.SUCCESS]: "Success",
  [PAYMENT_STATUS.FAILED]: "Failed",
  [PAYMENT_STATUS.TIMEOUT]: "Timeout",
};

function getStatusBadgeVariant(
  status: PaymentStatusType
): React.ComponentProps<typeof Badge>["variant"] {
  switch (status) {
    case PAYMENT_STATUS.SUCCESS:
      return "secondary";
    case PAYMENT_STATUS.FAILED:
    case PAYMENT_STATUS.TIMEOUT:
      return "destructive";
    case PAYMENT_STATUS.PROCESSING:
      return "default";
    default:
      return "outline";
  }
}

export type PaymentStatusProps = {
  status: PaymentStatusType;
  currentTransaction: Transaction | null;
  attemptText: string | null;
};

export function PaymentStatus({
  status,
  currentTransaction,
  attemptText,
}: PaymentStatusProps) {
  const badgeVariant = getStatusBadgeVariant(status);

  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{UI_TEXT.statusLabel}</p>
        <Badge variant={badgeVariant}>{STATUS_LABELS[status]}</Badge>
      </div>

      {attemptText ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium">{UI_TEXT.attemptsLabel}</p>
          <p className="text-sm text-muted-foreground">{attemptText}</p>
        </div>
      ) : null}

      {currentTransaction?.reason ? (
        <p className="text-sm text-muted-foreground">{currentTransaction.reason}</p>
      ) : null}
    </div>
  );
}

