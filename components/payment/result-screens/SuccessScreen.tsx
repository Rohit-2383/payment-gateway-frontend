"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { CURRENCY_SYMBOLS } from "@/constants/currencies";
import { formatTransactionTimestampFull, truncateTransactionId } from "@/utils/formatters";
import type { Transaction } from "@/types/payment";

function AnimatedCheck() {
  return (
    <div className="relative animate-scale-enter">
      <div className="animate-pulse-ring absolute inset-0 rounded-full bg-success/20" />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-success-subtle">
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
          <path
            className="animate-check-draw"
            d="M7 18 L13.5 24.5 L27 10"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            style={{ color: "var(--success-fg)" }}
          />
        </svg>
      </div>
    </div>
  );
}

export type SuccessScreenProps = {
  transaction: Transaction;
  onReset: () => void;
};

export const SuccessScreen = React.memo(function SuccessScreen({
  transaction,
  onReset,
}: SuccessScreenProps) {
  const headingRef = React.useRef<HTMLHeadingElement>(null);

  React.useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const amountDisplay = `${CURRENCY_SYMBOLS[transaction.currency]}${transaction.amount.toFixed(2)}`;

  return (
    <div className="animate-result-enter flex flex-col items-center gap-5 py-2 text-center">
      <AnimatedCheck />

      <div className="flex flex-col gap-1">
        <h3
          ref={headingRef}
          tabIndex={-1}
          className="text-xl font-semibold outline-none"
        >
          Payment Successful
        </h3>
        <p className="text-sm text-muted-foreground">Your payment has been processed.</p>
      </div>

      <dl className="w-full divide-y divide-border rounded-lg border text-left text-sm">
        <div className="flex justify-between gap-4 px-4 py-2.5">
          <dt className="shrink-0 font-medium text-muted-foreground">Transaction ID</dt>
          <dd className="text-right font-mono tabular-nums">
            {truncateTransactionId(transaction.transactionId)}
          </dd>
        </div>
        <div className="flex justify-between gap-4 px-4 py-2.5">
          <dt className="shrink-0 font-medium text-muted-foreground">Amount</dt>
          <dd className="text-right font-semibold tabular-nums">{amountDisplay}</dd>
        </div>
        <div className="flex justify-between gap-4 px-4 py-2.5">
          <dt className="shrink-0 font-medium text-muted-foreground">Date & Time</dt>
          <dd className="text-right text-xs">{formatTransactionTimestampFull(transaction.timestamp)}</dd>
        </div>
      </dl>

      <Button onClick={onReset} className="w-full sm:w-auto">
        Make Another Payment
      </Button>
    </div>
  );
});
