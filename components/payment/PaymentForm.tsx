"use client";

import * as React from "react";
import type { UseFormReturn } from "react-hook-form";

import { AmountInput } from "@/components/payment/inputs/AmountInput";
import { CVVInput } from "@/components/payment/inputs/CVVInput";
import { CardInput } from "@/components/payment/inputs/CardInput";
import { ExpiryInput } from "@/components/payment/inputs/ExpiryInput";
import { CardholderField } from "@/components/payment/CardholderField";
import { CurrencyField } from "@/components/payment/CurrencyField";
import { Separator } from "@/components/ui/separator";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PaymentPayload } from "@/types/payment";
import {
  type PaymentFormInputValues,
  type PaymentFormValues,
} from "@/utils/validators";

export type PaymentFormProps = {
  title: string;
  description?: string;
  form: UseFormReturn<PaymentFormInputValues, unknown, PaymentFormValues>;
  maxCVVLength: number;
  onSubmitPayment: (payload: PaymentPayload) => Promise<void> | void;
  children?: React.ReactNode;
};

export function PaymentForm({
  title,
  description,
  form,
  maxCVVLength,
  onSubmitPayment,
  children,
}: PaymentFormProps) {
  const onSubmit = React.useCallback(
    async (values: PaymentFormValues) => {
      const payload: PaymentPayload = {
        transactionId: crypto.randomUUID(),
        cardholderName: values.cardholderName,
        cardNumber: values.cardNumber,
        expiry: values.expiry,
        cvv: values.cvv,
        amount: values.amount,
        currency: values.currency,
      };

      await onSubmitPayment(payload);
    },
    [onSubmitPayment]
  );

  return (
    <>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <CardholderField control={form.control} />

          <CardInput control={form.control} name="cardNumber" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ExpiryInput control={form.control} name="expiry" />
            <CVVInput
              control={form.control}
              name="cvv"
              maxLength={maxCVVLength}
              placeholder={maxCVVLength === 4 ? "1234" : "123"}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AmountInput control={form.control} name="amount" />
            <CurrencyField control={form.control} />
          </div>

          <Separator className="my-1" />

          {children}
        </form>
      </CardContent>
    </>
  );
}

