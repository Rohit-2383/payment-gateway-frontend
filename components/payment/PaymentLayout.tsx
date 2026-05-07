"use client";

import * as React from "react";

import { CardPreview } from "@/components/payment/card-preview";
import { PaymentActions } from "@/components/payment/PaymentActions";
import { PaymentForm } from "@/components/payment/PaymentForm";
import { PaymentStatus } from "@/components/payment/PaymentStatus";
import { PaymentSummary } from "@/components/payment/PaymentSummary";
import TransactionHistory from "@/components/payment/TransactionHistory";
import { TransactionDetailsModal } from "@/components/payment/TransactionDetailsModal";
import { Card } from "@/components/ui/card";
import { usePayment } from "@/hooks/usePayment";
import { usePaymentForm } from "@/hooks/usePaymentForm";
import type { PaymentPayload } from "@/types/payment";
import { PAYMENT_STATUS } from "@/constants/payment";

const TransactionHistorySection = React.memo(function TransactionHistorySection() {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold tracking-tight">Transaction History</h2>
      <TransactionHistory />
    </section>
  );
});

const UI_TEXT = {
  title: "Payment Gateway",
  subtitle: "Production-quality payment form (demo)",
  leftTitle: "Pay",
  leftDescription: "Real-time validation, formatting, and card detection.",
} as const;

export function PaymentLayout() {
  const payment = usePayment();
  const paymentForm = usePaymentForm();

  const isProcessing = payment.status === PAYMENT_STATUS.PROCESSING;

  const onSubmitPayment = React.useCallback(
    async (payload: PaymentPayload) => {
      await payment.handlePayment(payload);
    },
    [payment]
  );

  const onReset = React.useCallback(() => {
    paymentForm.form.reset();
    payment.resetPayment();
  }, [payment, paymentForm.form]);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 px-4 py-10 font-sans dark:bg-black">
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">{UI_TEXT.title}</h1>
          <p className="text-sm text-muted-foreground">{UI_TEXT.subtitle}</p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="ring-1 ring-foreground/10">
            <PaymentForm
              title={UI_TEXT.leftTitle}
              description={UI_TEXT.leftDescription}
              form={paymentForm.form}
              maxCVVLength={paymentForm.maxCVVLength}
              onSubmitPayment={onSubmitPayment}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <PaymentStatus
                  status={payment.status}
                  currentTransaction={payment.currentTransaction}
                  attemptText={payment.attemptText}
                />
                <PaymentActions
                  isProcessing={isProcessing}
                  isSubmitDisabled={!paymentForm.form.formState.isValid || isProcessing}
                  canRetry={payment.canRetry}
                  onRetry={payment.retryPayment}
                  onReset={onReset}
                />
              </div>
            </PaymentForm>
          </Card>

          <div className="flex flex-col gap-4">
            <CardPreview
              cardType={paymentForm.cardType}
              cardNumber={paymentForm.watched.cardNumber}
              cardholderName={paymentForm.watched.cardholderName}
              expiry={paymentForm.watched.expiry}
            >
              <CardPreview.Badge />
              <CardPreview.Number />
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-4">
                <CardPreview.Name />
                <CardPreview.Expiry />
              </div>
            </CardPreview>

            <PaymentSummary />
          </div>
        </div>

        <TransactionHistorySection />
      </main>

      <TransactionDetailsModal />
    </div>
  );
}
