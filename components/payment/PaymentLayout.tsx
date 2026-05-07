"use client";

import * as React from "react";
import { CreditCard } from "lucide-react";

import { CardPreview } from "@/components/payment/card-preview";
import { PaymentActions } from "@/components/payment/PaymentActions";
import { PaymentForm } from "@/components/payment/PaymentForm";
import { StatusPanel } from "@/components/payment/StatusPanel";
import { PaymentSummary } from "@/components/payment/PaymentSummary";
import TransactionHistory from "@/components/payment/TransactionHistory";
import { TransactionDetailsModal } from "@/components/payment/transaction-details-modal";
import { Card } from "@/components/ui/card";
import { usePayment } from "@/hooks/usePayment";
import { usePaymentForm } from "@/hooks/usePaymentForm";
import type { PaymentPayload } from "@/types/payment";
import { PAYMENT_STATUS, UI_TEXT } from "@/constants/payment";

const TransactionHistorySection = React.memo(function TransactionHistorySection() {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold tracking-tight">Transaction History</h2>
      <TransactionHistory />
    </section>
  );
});

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
    <div className="flex flex-1 flex-col bg-background px-4 py-10 font-sans">
      {/* Decorative radial gradient */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-brand/5 blur-[100px]" />
      </div>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6">
        <header className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand text-brand-foreground shadow-sm">
              <CreditCard className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">{UI_TEXT.title}</h1>
              </div>
              <p className="text-sm text-muted-foreground">{UI_TEXT.subtitle}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="ring-1 ring-foreground/10">
            <PaymentForm
              title={UI_TEXT.leftTitle}
              description={UI_TEXT.leftDescription}
              form={paymentForm.form}
              maxCVVLength={paymentForm.maxCVVLength}
              cardType={paymentForm.cardType}
              onSubmitPayment={onSubmitPayment}
            >
              <StatusPanel
                status={payment.status}
                currentTransaction={payment.currentTransaction}
                attemptText={payment.attemptText}
                canRetry={payment.canRetry}
                isSlowNetwork={payment.isSlowNetwork}
                onRetry={payment.retryPayment}
                onReset={onReset}
              />
              <PaymentActions
                isProcessing={isProcessing}
                isFormValid={paymentForm.form.formState.isValid}
                status={payment.status}
                onReset={onReset}
              />
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
              <div className="flex flex-col gap-2 sm:gap-3 md:flex-row md:items-end md:justify-between md:gap-4">
                <CardPreview.Name />
                <CardPreview.Expiry />
              </div>
            </CardPreview>

            <PaymentSummary />
          </div>
        </div>

        <TransactionHistorySection />
      </main>

      <TransactionDetailsModal>
        <TransactionDetailsModal.Content />
      </TransactionDetailsModal>
    </div>
  );
}
