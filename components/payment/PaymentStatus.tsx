"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import type { PaymentStatus as PaymentStatusType, Transaction } from "@/types/payment";
import {
  PAYMENT_STATUS,
  TERMINAL_STATUSES,
  STATUS_LABELS,
} from "@/constants/payment";

const UI_TEXT = {
  statusLabel: "Status",
  attemptsLabel: "Attempts",
} as const;

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
  const statusHeadingRef = React.useRef<HTMLHeadingElement>(null);

  React.useEffect(() => {
    if (TERMINAL_STATUSES.has(status)) {
      statusHeadingRef.current?.focus();
    }
  }, [status]);

  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-3">
      <div className="flex items-center justify-between gap-3">
        <h3
          ref={statusHeadingRef}
          tabIndex={-1}
          className="text-sm font-medium outline-none"
        >
          {UI_TEXT.statusLabel}
        </h3>
        <Badge variant={badgeVariant}>{STATUS_LABELS[status]}</Badge>
      </div>

      {attemptText ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium">{UI_TEXT.attemptsLabel}</p>
          <p className="text-sm text-muted-foreground">{attemptText}</p>
        </div>
      ) : null}

      {currentTransaction?.reason ? (
        <p className="text-sm text-muted-foreground wrap-break-word overflow-hidden">
          {currentTransaction.reason}
        </p>
      ) : null}
    </div>
  );
}
