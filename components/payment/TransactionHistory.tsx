"use client";

import { memo, useCallback, useState } from "react";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePaymentStore } from "@/store/paymentStore";
import type { Transaction } from "@/types/payment";
import { CURRENCY_SYMBOLS } from "@/constants/currencies";
import { TRANSACTION_STATUS_CLASSES } from "@/constants/payment";
import { cn } from "@/lib/utils";
import {
  formatTransactionTimestamp,
  truncateTransactionId,
} from "@/utils/formatters";

const COLUMN_HEADERS = [
  "Transaction ID",
  "Amount",
  "Status",
  "Date & Time",
  "Actions",
] as const;

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

  const statusBadge = (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        badgeClass
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {transaction.status}
    </span>
  );

  const viewButton = (
    <button
      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      onClick={handleClick}
      aria-label={`View transaction details for ${truncatedId}`}
    >
      <ChevronRight className="h-4 w-4" aria-hidden="true" />
    </button>
  );

  return (
    <tr className="block border-b border-gray-100 transition-colors last:border-b-0 hover:bg-muted/30 sm:table-row">
      {/* Mobile stacked card — hidden at sm+ */}
      <td colSpan={5} className="block px-4 py-3 sm:hidden">
        <div className="flex items-center justify-between gap-2">
          <span className="min-w-0 font-mono text-sm tabular-nums">{truncatedId}</span>
          {statusBadge}
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <span className="shrink-0 text-sm font-medium tabular-nums">{amountDisplay}</span>
          <span className="min-w-0 truncate text-xs text-muted-foreground">
            {timestampDisplay}
          </span>
          {viewButton}
        </div>
      </td>

      {/* Desktop cells — hidden below sm */}
      <td className="hidden px-4 py-3 font-mono text-sm tabular-nums sm:table-cell">{truncatedId}</td>
      <td className="hidden px-4 py-3 text-sm font-medium tabular-nums sm:table-cell">{amountDisplay}</td>
      <td className="hidden px-4 py-3 sm:table-cell">{statusBadge}</td>
      <td className="hidden px-4 py-3 text-xs text-muted-foreground sm:table-cell">
        {timestampDisplay}
      </td>
      <td className="hidden px-4 py-3 sm:table-cell">{viewButton}</td>
    </tr>
  );
});

function ClearHistoryConfirmDialog({
  open,
  count,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onCancel(); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Clear transaction history?</DialogTitle>
          <DialogDescription>
            This will permanently delete all {count}{" "}
            {count === 1 ? "transaction record" : "transaction records"}. This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={onConfirm}>
            Clear All
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const TransactionHistory = memo(function TransactionHistory() {
  const transactions = usePaymentStore((s) => s.transactions);
  const setSelectedTransaction = usePaymentStore((s) => s.setSelectedTransaction);
  const clearTransactions = usePaymentStore((s) => s.clearTransactions);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleRowClick = useCallback(
    (transaction: Transaction) => {
      setSelectedTransaction(transaction);
    },
    [setSelectedTransaction]
  );

  const handleConfirmClear = useCallback(() => {
    clearTransactions();
    setIsConfirmOpen(false);
  }, [clearTransactions]);

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="font-medium text-muted-foreground">No transactions yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Completed transactions will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
            {transactions.length} {transactions.length === 1 ? "transaction" : "transactions"}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsConfirmOpen(true)}
            className="border-danger/30 text-danger-fg hover:border-danger/50 hover:bg-danger-subtle hover:text-danger-fg"
          >
            Clear History
          </Button>
        </div>

        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full caption-bottom">
            <thead className="hidden bg-muted/50 sm:table-header-group">
              <tr>
                {COLUMN_HEADERS.map((header) => (
                  <th
                    key={header}
                    className="h-10 px-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <TransactionRow
                  key={transaction.transactionId}
                  transaction={transaction}
                  onClick={handleRowClick}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ClearHistoryConfirmDialog
        open={isConfirmOpen}
        count={transactions.length}
        onConfirm={handleConfirmClear}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </>
  );
});

export default TransactionHistory;
