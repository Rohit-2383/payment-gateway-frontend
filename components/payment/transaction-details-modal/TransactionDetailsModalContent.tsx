"use client";

import * as React from "react";

import {
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CURRENCY_SYMBOLS } from "@/constants/currencies";
import { MAX_RETRY_ATTEMPTS, REASON_VISIBLE_STATUSES } from "@/constants/payment";
import { formatTransactionTimestampFull } from "@/utils/formatters";
import { TransactionDetailRow } from "./TransactionDetailRow";
import { TransactionStatusBadge } from "./TransactionStatusBadge";
import { useTransactionModalContext } from "./TransactionModalContext";

export const TransactionDetailsModalContent = React.memo(
  function TransactionDetailsModalContent() {
    const { transaction } = useTransactionModalContext();
    const closeBtnRef = React.useRef<HTMLButtonElement>(null);

    React.useEffect(() => {
      closeBtnRef.current?.focus();
    }, []);

    const amountValue = `${CURRENCY_SYMBOLS[transaction.currency]}${transaction.amount.toFixed(2)}`;
    const attemptsValue = `${transaction.retryCount} of ${MAX_RETRY_ATTEMPTS} attempts`;
    const showReason =
      REASON_VISIBLE_STATUSES.has(transaction.status) && Boolean(transaction.reason);

    return (
      <>
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent max-h-[60vh] overflow-y-auto">
          <TransactionDetailRow
            label="Transaction ID"
            value={transaction.transactionId}
            mono
          />

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

        <DialogFooter>
          <DialogClose asChild>
            <Button ref={closeBtnRef} variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </>
    );
  }
);
