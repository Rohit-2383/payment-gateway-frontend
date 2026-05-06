import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  PaymentStatus,
  Transaction,
} from "@/types/payment";

interface PaymentStore {
  status: PaymentStatus;
  currentTransaction: Transaction | null;
  transactions: Transaction[];
  selectedTransaction: Transaction | null;

  setStatus: (status: PaymentStatus) => void;

  setCurrentTransaction: (
    transaction: Transaction | null
  ) => void;

  addTransaction: (transaction: Transaction) => void;

  updateTransaction: (
    transactionId: string,
    updates: Partial<Transaction>
  ) => void;

  setSelectedTransaction: (
    transaction: Transaction | null
  ) => void;

  resetPayment: () => void;
}

const initialState = {
  status: "idle" as PaymentStatus,
  currentTransaction: null,
  selectedTransaction: null,
};

export const usePaymentStore = create<PaymentStore>()(
  persist(
    (set) => ({
      ...initialState,

      transactions: [],

      setStatus: (status) =>
        set({
          status,
        }),

      setCurrentTransaction: (transaction) =>
        set({
          currentTransaction: transaction,
        }),

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        })),

      updateTransaction: (transactionId, updates) =>
        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.transactionId === transactionId
              ? {
                  ...transaction,
                  ...updates,
                }
              : transaction
          ),

          currentTransaction:
            state.currentTransaction?.transactionId === transactionId
              ? {
                  ...state.currentTransaction,
                  ...updates,
                }
              : state.currentTransaction,
        })),

      setSelectedTransaction: (transaction) =>
        set({
          selectedTransaction: transaction,
        }),

      resetPayment: () =>
        set({
          ...initialState,
        }),
    }),
    {
      name: "payment-transactions-storage",

      partialize: (state) => ({
        transactions: state.transactions,
      }),
    }
  )
);