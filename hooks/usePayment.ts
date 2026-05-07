"use client";

import { useCallback, useMemo, useRef } from "react";

import type { PaymentPayload } from "@/types/payment";
import { usePaymentStore } from "@/store/paymentStore";
import { MAX_RETRY_ATTEMPTS, PAYMENT_STATUS } from "@/constants/payment";
import { processPayment } from "@/utils/payment";

const SLOW_NETWORK_THRESHOLD_MS = 3000;

function nowIsoString(): string {
  return new Date().toISOString();
}

export function usePayment() {
  const status = usePaymentStore((s) => s.status);
  const currentTransaction = usePaymentStore((s) => s.currentTransaction);
  const isSlowNetwork = usePaymentStore((s) => s.isSlowNetwork);

  const setStatus = usePaymentStore((s) => s.setStatus);
  const setCurrentTransaction = usePaymentStore((s) => s.setCurrentTransaction);
  const addTransaction = usePaymentStore((s) => s.addTransaction);
  const updateTransaction = usePaymentStore((s) => s.updateTransaction);
  const setIsSlowNetwork = usePaymentStore((s) => s.setIsSlowNetwork);
  const resetPayment = usePaymentStore((s) => s.resetPayment);

  // Persists original card payload for retries (not stored in Zustand — card details shouldn't outlive the session)
  const lastPayloadRef = useRef<PaymentPayload | null>(null);

  const canRetry = useMemo(() => {
    if (!currentTransaction) return false;
    if (status === PAYMENT_STATUS.PROCESSING) return false;
    if (status !== PAYMENT_STATUS.FAILED && status !== PAYMENT_STATUS.TIMEOUT) return false;
    return currentTransaction.retryCount < MAX_RETRY_ATTEMPTS;
  }, [currentTransaction, status]);

  const attemptText = useMemo((): string | null => {
    if (!currentTransaction) return null;
    if (status === PAYMENT_STATUS.IDLE) return null;
    return `Attempt ${currentTransaction.retryCount} of ${MAX_RETRY_ATTEMPTS}`;
  }, [currentTransaction, status]);

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

      const slowTimer = setTimeout(() => setIsSlowNetwork(true), SLOW_NETWORK_THRESHOLD_MS);

      try {
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
      } finally {
        clearTimeout(slowTimer);
        setIsSlowNetwork(false);
      }
    },
    [addTransaction, setCurrentTransaction, setIsSlowNetwork, setStatus, status, updateTransaction]
  );

  const retryPayment = useCallback(async () => {
    const payload = lastPayloadRef.current;
    if (!payload || !currentTransaction) return;
    if (status === PAYMENT_STATUS.PROCESSING) return;
    if (currentTransaction.retryCount >= MAX_RETRY_ATTEMPTS) return;

    const nextAttempt = currentTransaction.retryCount + 1;
    const startedAt = nowIsoString();

    setStatus(PAYMENT_STATUS.PROCESSING);
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

    const slowTimer = setTimeout(() => setIsSlowNetwork(true), SLOW_NETWORK_THRESHOLD_MS);

    try {
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
    } finally {
      clearTimeout(slowTimer);
      setIsSlowNetwork(false);
    }
  }, [currentTransaction, setCurrentTransaction, setIsSlowNetwork, setStatus, status, updateTransaction]);

  return {
    status,
    currentTransaction,
    isSlowNetwork,
    canRetry,
    attemptText,
    handlePayment,
    retryPayment,
    resetPayment,
  };
}
