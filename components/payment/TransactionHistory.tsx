"use client";

import { memo, useCallback } from "react";

import { usePaymentStore } from "@/store/paymentStore";
import type { Transaction } from "@/types/payment";
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

  const truncatedId = truncateTransactionId(transaction.transactionId);
  const badgeClass = TRANSACTION_STATUS_CLASSES[transaction.status];
  const amountDisplay = `${CURRENCY_SYMBOLS[transaction.currency]}${transaction.amount.toFixed(2)}`;
  const timestampDisplay = formatTransactionTimestamp(transaction.timestamp);

  return (
    <div className="overflow-hidden border-b border-gray-100 last:border-b-0 hover:bg-muted/30 transition-colors">
      {/* Mobile layout — hidden at sm+ */}
      <div className="sm:hidden px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-sm min-w-[90px]">{truncatedId}</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize shrink-0 ${badgeClass}`}>
            {transaction.status}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-1.5">
          <span className="text-sm font-medium shrink-0 min-w-[80px]">
            {amountDisplay}
          </span>
          <span className="text-xs text-muted-foreground min-w-0 truncate mx-2">
            {timestampDisplay}
          </span>
          <button
            className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline shrink-0"
            onClick={handleClick}
            aria-label={`View transaction details for ${truncatedId}`}
          >
            View →
          </button>
        </div>
      </div>

      {/* Desktop layout — hidden below sm */}
      <div className="hidden sm:grid sm:grid-cols-[auto_1fr_auto_auto_auto] items-center gap-3 px-4 py-3">
        <span className="font-mono text-sm truncate min-w-[90px]">
          {truncatedId}
        </span>
        <span className="text-sm font-medium text-left min-w-[80px]">
          {amountDisplay}
        </span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize shrink-0 ${badgeClass}`}>
          {transaction.status}
        </span>
        <span className="text-xs text-muted-foreground">
          {timestampDisplay}
        </span>
        <button
          className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
          onClick={handleClick}
          aria-label={`View transaction details for ${truncatedId}`}
        >
          View →
        </button>
      </div>
    </div>
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
    <div className="overflow-hidden rounded-lg border border-gray-200">
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
