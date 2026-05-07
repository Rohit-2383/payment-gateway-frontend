"use client";

import * as React from "react";
import type { Transaction } from "@/types/payment";

export type TransactionModalContextValue = {
  transaction: Transaction;
};

export const TransactionModalContext =
  React.createContext<TransactionModalContextValue | null>(null);

export function useTransactionModalContext(): TransactionModalContextValue {
  const ctx = React.useContext(TransactionModalContext);
  if (ctx === null) {
    throw new Error(
      "useTransactionModalContext must be used within a TransactionDetailsModalRoot"
    );
  }
  return ctx;
}
