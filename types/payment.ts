import {
  PAYMENT_STATUS,
  CARD_TYPES,
  CURRENCIES,
} from "@/utils/constants";

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export type CardType =
  (typeof CARD_TYPES)[keyof typeof CARD_TYPES];

export type Currency =
  (typeof CURRENCIES)[keyof typeof CURRENCIES];

  export interface PaymentPayload {
  transactionId: string;
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  amount: number;
  currency: Currency;
}

export interface PaymentResponse {
  success: boolean;
  status: PaymentStatus;
  reason?: string;
}

export interface Transaction {
  transactionId: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  timestamp: string;
  retryCount: number;
  reason?: string;
}