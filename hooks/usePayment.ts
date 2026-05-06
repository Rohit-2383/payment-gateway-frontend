"use client";

import { useCallback, useMemo, useRef } from "react";

import type { PaymentPayload } from "@/types/payment";
import { usePaymentStore } from "@/store/paymentStore";
import {
  MAX_RETRY_ATTEMPTS,
  PAYMENT_STATUS,
} from "@/utils/constants";
import { processPayment } from "@/utils/payment";

function nowIsoString(): string {
  return new Date().toISOString();
}

export function usePayment() {
  const status = usePaymentStore((state) => state.status);
  const currentTransaction = usePaymentStore(
    (state) => state.currentTransaction
  );

  const setStatus = usePaymentStore((state) => state.setStatus);
  const setCurrentTransaction = usePaymentStore(
    (state) => state.setCurrentTransaction
  );
  const addTransaction = usePaymentStore((state) => state.addTransaction);
  const updateTransaction = usePaymentStore(
    (state) => state.updateTransaction
  );
  const resetPayment = usePaymentStore((state) => state.resetPayment);

  const lastPayloadRef = useRef<PaymentPayload | null>(null);

  const canRetry = useMemo(() => {
    if (!currentTransaction) return false;
    if (status === PAYMENT_STATUS.PROCESSING) return false;
    if (
      status !== PAYMENT_STATUS.FAILED &&
      status !== PAYMENT_STATUS.TIMEOUT
    ) {
      return false;
    }
    return currentTransaction.retryCount < MAX_RETRY_ATTEMPTS;
  }, [currentTransaction, status]);

  const attemptText = useMemo(() => {
    if (!currentTransaction) return null;
    return `Attempt ${currentTransaction.retryCount} of ${MAX_RETRY_ATTEMPTS}`;
  }, [currentTransaction]);

  const handlePayment = useCallback(
    async (payload: PaymentPayload) => {
      if (status === PAYMENT_STATUS.PROCESSING) return;

      lastPayloadRef.current = payload;

      setStatus(PAYMENT_STATUS.PROCESSING);

      const startedAt = nowIsoString();
      const transaction = {
        transactionId: payload.transactionId,
        amount: payload.amount,
        currency: payload.currency,
        status: PAYMENT_STATUS.PROCESSING,
        timestamp: startedAt,
        retryCount: 1,
      } as const;

      setCurrentTransaction(transaction);
      addTransaction(transaction);

      const response = await processPayment(payload);

      const completedAt = nowIsoString();

      setStatus(response.status);
      updateTransaction(payload.transactionId, {
        status: response.status,
        timestamp: completedAt,
        reason: response.reason,
        retryCount: 1,
      });

      setCurrentTransaction({
        ...transaction,
        status: response.status,
        timestamp: completedAt,
        reason: response.reason,
      });
    },
    [
      addTransaction,
      setCurrentTransaction,
      setStatus,
      status,
      updateTransaction,
    ]
  );

  const retryPayment = useCallback(async () => {
    const payload = lastPayloadRef.current;
    if (!payload) return;
    if (!currentTransaction) return;
    if (status === PAYMENT_STATUS.PROCESSING) return;
    if (currentTransaction.retryCount >= MAX_RETRY_ATTEMPTS) return;

    const nextAttempt = currentTransaction.retryCount + 1;

    setStatus(PAYMENT_STATUS.PROCESSING);

    const startedAt = nowIsoString();

    updateTransaction(currentTransaction.transactionId, {
      status: PAYMENT_STATUS.PROCESSING,
      timestamp: startedAt,
      reason: undefined,
      retryCount: nextAttempt,
    });

    const optimistic = {
      ...currentTransaction,
      status: PAYMENT_STATUS.PROCESSING,
      timestamp: startedAt,
      reason: undefined,
      retryCount: nextAttempt,
    } as const;

    setCurrentTransaction(optimistic);

    const response = await processPayment(payload);

    const completedAt = nowIsoString();

    setStatus(response.status);

    updateTransaction(currentTransaction.transactionId, {
      status: response.status,
      timestamp: completedAt,
      reason: response.reason,
      retryCount: nextAttempt,
    });

    setCurrentTransaction({
      ...optimistic,
      status: response.status,
      timestamp: completedAt,
      reason: response.reason,
    });
  }, [
    currentTransaction,
    setCurrentTransaction,
    setStatus,
    status,
    updateTransaction,
  ]);

  return {
    status,
    currentTransaction,
    canRetry,
    attemptText,
    handlePayment,
    retryPayment,
    resetPayment,
  };
}
