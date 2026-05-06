"use client";

import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCardDetection } from "@/hooks/useCardDetection";
import { CURRENCIES } from "@/utils/constants";
import {
  paymentFormSchema,
  type PaymentFormInputValues,
  type PaymentFormValues,
} from "@/utils/validators";

export type UsePaymentFormResult = {
  form: ReturnType<typeof useForm<PaymentFormInputValues, unknown, PaymentFormValues>>;
  watched: {
    cardNumber: string;
    cardholderName: string;
    expiry: string;
  };
  cardType: ReturnType<typeof useCardDetection>["cardType"];
  maxCVVLength: ReturnType<typeof useCardDetection>["maxCVVLength"];
};

export function usePaymentForm(): UsePaymentFormResult {
  const form = useForm<PaymentFormInputValues, unknown, PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    mode: "onChange",
    defaultValues: {
      cardholderName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
      amount: "",
      currency: CURRENCIES.INR,
    },
  });

  const cardNumber = useWatch({ control: form.control, name: "cardNumber" }) ?? "";
  const cardholderName =
    useWatch({ control: form.control, name: "cardholderName" }) ?? "";
  const expiry = useWatch({ control: form.control, name: "expiry" }) ?? "";

  const detection = useCardDetection(cardNumber);

  const watched = useMemo(
    () => ({
      cardNumber,
      cardholderName,
      expiry,
    }),
    [cardNumber, cardholderName, expiry]
  );

  return {
    form,
    watched,
    cardType: detection.cardType,
    maxCVVLength: detection.maxCVVLength,
  };
}

