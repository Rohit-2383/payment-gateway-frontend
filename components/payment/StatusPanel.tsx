"use client";

import * as React from "react";

import { PAYMENT_STATUS } from "@/constants/payment";
import type { PaymentStatus, Transaction } from "@/types/payment";
import {
  SuccessScreen,
  FailedScreen,
  TimeoutScreen,
  ProcessingScreen,
} from "@/components/payment/result-screens";

export type StatusPanelProps = {
  status: PaymentStatus;
  currentTransaction: Transaction | null;
  attemptText: string | null;
  canRetry: boolean;
  isSlowNetwork: boolean;
  onRetry: () => Promise<void> | void;
  onReset: () => void;
};

export function StatusPanel({
  status,
  currentTransaction,
  attemptText,
  canRetry,
  isSlowNetwork,
  onRetry,
  onReset,
}: StatusPanelProps) {
  if (status === PAYMENT_STATUS.IDLE) return null;

  return (
    <div className="rounded-xl border bg-card px-6 py-8 shadow-sm">
      {status === PAYMENT_STATUS.PROCESSING && (
        <ProcessingScreen isSlowNetwork={isSlowNetwork} />
      )}

      {status === PAYMENT_STATUS.SUCCESS && currentTransaction !== null && (
        <SuccessScreen transaction={currentTransaction} onReset={onReset} />
      )}

      {status === PAYMENT_STATUS.FAILED && currentTransaction !== null && (
        <FailedScreen
          transaction={currentTransaction}
          attemptText={attemptText}
          canRetry={canRetry}
          onRetry={onRetry}
          onReset={onReset}
        />
      )}

      {status === PAYMENT_STATUS.TIMEOUT && currentTransaction !== null && (
        <TimeoutScreen
          transaction={currentTransaction}
          attemptText={attemptText}
          canRetry={canRetry}
          onRetry={onRetry}
          onReset={onReset}
        />
      )}
    </div>
  );
}
