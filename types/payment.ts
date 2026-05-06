export type PaymentStatus =
  | "idle"
  | "processing"
  | "success"
  | "failed"
  | "timeout";

export type CardType =
  | "visa"
  | "mastercard"
  | "amex"
  | "unknown";

export type Currency = "INR" | "USD";

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