import { create } from "zustand";
import { persist } from "zustand/middleware";

import { PaymentStatus, Transaction } from "@/types/payment";
import { PAYMENT_STATUS } from "@/constants/payment";

interface PaymentStore {
  status: PaymentStatus;
  currentTransaction: Transaction | null;
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  isSlowNetwork: boolean;

  setStatus: (status: PaymentStatus) => void;
  setCurrentTransaction: (transaction: Transaction | null) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transactionId: string, updates: Partial<Transaction>) => void;
  setSelectedTransaction: (transaction: Transaction | null) => void;
  setIsSlowNetwork: (value: boolean) => void;
  clearTransactions: () => void;
  resetPayment: () => void;
}

const initialState = {
  status: PAYMENT_STATUS.IDLE,
  currentTransaction: null,
  selectedTransaction: null,
  isSlowNetwork: false,
};

export const usePaymentStore = create<PaymentStore>()(
  persist(
    (set) => ({
      ...initialState,
      transactions: [],

      setStatus: (status) => set({ status }),

      setCurrentTransaction: (transaction) => set({ currentTransaction: transaction }),

      addTransaction: (transaction) =>
        set((state) => ({ transactions: [transaction, ...state.transactions] })),

      updateTransaction: (transactionId, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.transactionId === transactionId ? { ...t, ...updates } : t
          ),
          currentTransaction:
            state.currentTransaction?.transactionId === transactionId
              ? { ...state.currentTransaction, ...updates }
              : state.currentTransaction,
        })),

      setSelectedTransaction: (transaction) => set({ selectedTransaction: transaction }),

      setIsSlowNetwork: (value) => set({ isSlowNetwork: value }),

      clearTransactions: () => set({ transactions: [] }),

      resetPayment: () => set({ ...initialState }),
    }),
    {
      name: "payment-transactions-storage",
      partialize: (state) => ({ transactions: state.transactions }),
    }
  )
);
