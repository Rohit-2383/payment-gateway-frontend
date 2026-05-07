"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { DialogClose, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CURRENCY_SYMBOLS } from "@/constants/currencies";
import { MAX_RETRY_ATTEMPTS, REASON_VISIBLE_STATUSES } from "@/constants/payment";
import { formatAmountParts, formatTransactionTimestampFull } from "@/utils/formatters";
import { TransactionDetailRow } from "./TransactionDetailRow";
import { TransactionStatusBadge } from "./TransactionStatusBadge";
import { useTransactionModalContext } from "./TransactionModalContext";

function CopyableId({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(() => {
    void navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [value]);

  return (
    <button
      onClick={handleCopy}
      className="group flex items-center gap-1.5 text-right text-sm font-mono text-foreground transition-colors hover:text-brand"
      title="Click to copy full ID"
    >
      <span className="break-all tabular-nums">{value}</span>
      {copied ? (
        <Check className="h-3.5 w-3.5 shrink-0 text-success" aria-label="Copied" />
      ) : (
        <Copy
          className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-60"
          aria-hidden="true"
        />
      )}
    </button>
  );
}

export const TransactionDetailsModalContent = React.memo(
  function TransactionDetailsModalContent() {
    const { transaction } = useTransactionModalContext();
    const closeBtnRef = React.useRef<HTMLButtonElement>(null);

    React.useEffect(() => {
      closeBtnRef.current?.focus();
    }, []);

    const currencySymbol = CURRENCY_SYMBOLS[transaction.currency];
    const amountParts = formatAmountParts(transaction.amount);
    const amountValue = `${currencySymbol}${transaction.amount.toFixed(2)}`;
    const attemptsValue = `${transaction.retryCount} of ${MAX_RETRY_ATTEMPTS}`;
    const showReason =
      REASON_VISIBLE_STATUSES.has(transaction.status) && Boolean(transaction.reason);

    return (
      /* Single wrapper div so the grid DialogContent sees one item;
         flex-col handles internal layout cleanly without fighting DialogFooter margins */
      <div className="flex flex-col">
        {/* Visually hidden title satisfies Radix accessibility requirement */}
        <DialogTitle className="sr-only">Transaction Details</DialogTitle>

        {/* Premium header — large amount + status */}
        <div className="flex-none border-b border-border px-6 py-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Transaction Details
          </p>
          <div className="mt-2.5 flex items-end justify-between gap-4">
            <p className="flex items-baseline gap-0.5 tabular-nums">
              <span className="text-base font-medium text-muted-foreground">{currencySymbol}</span>
              <span className="text-3xl font-bold">{amountParts.whole}</span>
              <span className="text-lg font-semibold text-muted-foreground">.{amountParts.decimals}</span>
            </p>
            <TransactionStatusBadge />
          </div>
        </div>

        {/* Scrollable detail rows */}
        <div className="flex-1 overflow-y-auto px-6" style={{ maxHeight: "50vh" }}>
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-2.5">
            <span className="shrink-0 text-sm font-medium text-muted-foreground">
              Transaction ID
            </span>
            <CopyableId value={transaction.transactionId} />
          </div>

          <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-2.5">
            <span className="shrink-0 text-sm font-medium text-muted-foreground">Status</span>
            <TransactionStatusBadge />
          </div>

          <TransactionDetailRow label="Amount" value={amountValue} />
          <TransactionDetailRow
            label="Date & Time"
            value={formatTransactionTimestampFull(transaction.timestamp)}
          />
          <TransactionDetailRow label="Attempts" value={attemptsValue} />

          {showReason && transaction.reason && (
            <TransactionDetailRow label="Reason" value={transaction.reason} />
          )}
        </div>

        {/* Footer — plain div avoids DialogFooter's negative-margin compensations */}
        <div className="flex-none border-t border-border bg-muted/30 px-6 py-4 sm:flex sm:justify-end">
          <DialogClose asChild>
            <Button ref={closeBtnRef} variant="outline" className="w-full sm:w-auto">
              Close
            </Button>
          </DialogClose>
        </div>
      </div>
    );
  }
);
