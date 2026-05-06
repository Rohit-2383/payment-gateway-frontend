"use client";

import { memo, useCallback } from "react";

import { usePaymentStore } from "@/store/paymentStore";
import { Transaction } from "@/types/payment";
import { CURRENCY_SYMBOLS } from "@/constants/currencies";
import { TRANSACTION_STATUS_CLASSES } from "@/constants/payment";
import {
  formatTransactionTimestamp,
  truncateTransactionId,
} from "@/utils/formatters";

interface TransactionRowProps {
  transaction: Transaction;
  onClick: (transaction: Transaction) => void;
}

const TransactionRow = memo(function TransactionRow({
  transaction,
  onClick,
}: TransactionRowProps) {
  const handleClick = useCallback(() => {
    onClick(transaction);
  }, [onClick, transaction]);

  return (
    <button
      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
      onClick={handleClick}
      aria-label={`View transaction ${transaction.transactionId}`}
    >
      <span className="font-mono text-sm text-gray-700 shrink-0">
        {truncateTransactionId(transaction.transactionId)}
      </span>

      <span className="text-sm font-medium text-gray-900 mx-4 shrink-0">
        {CURRENCY_SYMBOLS[transaction.currency]}
        {transaction.amount.toFixed(2)}
      </span>

      <span
        className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize shrink-0 ${TRANSACTION_STATUS_CLASSES[transaction.status]}`}
      >
        {transaction.status}
      </span>

      <span className="text-xs text-gray-500 ml-4 shrink-0">
        {formatTransactionTimestamp(transaction.timestamp)}
      </span>
    </button>
  );
});

const TransactionHistory = memo(function TransactionHistory() {
  const transactions = usePaymentStore((s) => s.transactions);
  const setSelectedTransaction = usePaymentStore(
    (s) => s.setSelectedTransaction
  );

  const handleRowClick = useCallback(
    (transaction: Transaction) => {
      setSelectedTransaction(transaction);
    },
    [setSelectedTransaction]
  );

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-gray-500 font-medium">No transactions yet</p>
        <p className="text-gray-400 text-sm mt-1">
          Completed transactions will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 overflow-hidden">
      {transactions.map((transaction) => (
        <TransactionRow
          key={transaction.transactionId}
          transaction={transaction}
          onClick={handleRowClick}
        />
      ))}
    </div>
  );
});

export default TransactionHistory;
