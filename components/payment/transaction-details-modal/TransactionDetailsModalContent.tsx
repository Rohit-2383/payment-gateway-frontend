import * as React from "react";

import { CURRENCY_SYMBOLS } from "@/constants/currencies";
import {
  MAX_RETRY_ATTEMPTS,
  REASON_VISIBLE_STATUSES,
} from "@/constants/payment";
import {
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatTransactionTimestampFull } from "@/utils/formatters";
import type { Transaction } from "@/types/payment";
import { DetailRow } from "./DetailRow";
import { TransactionStatusBadge } from "./TransactionStatusBadge";

interface TransactionDetailsModalContentProps {
  transaction: Transaction;
  closeBtnRef: React.RefObject<HTMLButtonElement | null>;
}

export function TransactionDetailsModalContent({
  transaction,
  closeBtnRef,
}: TransactionDetailsModalContentProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Transaction Details</DialogTitle>
      </DialogHeader>

      <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent flex flex-col">
        <DetailRow label="Transaction ID">
          <span className="font-mono break-all">{transaction.transactionId}</span>
        </DetailRow>

        <DetailRow label="Status">
          <TransactionStatusBadge status={transaction.status} />
        </DetailRow>

        <DetailRow label="Amount">
          {CURRENCY_SYMBOLS[transaction.currency]}
          {transaction.amount.toFixed(2)}
        </DetailRow>

        <DetailRow label="Date & Time">
          {formatTransactionTimestampFull(transaction.timestamp)}
        </DetailRow>

        <DetailRow label="Attempts">
          {transaction.retryCount} of {MAX_RETRY_ATTEMPTS}
        </DetailRow>

        {REASON_VISIBLE_STATUSES.has(transaction.status) &&
          transaction.reason && (
            <DetailRow label="Reason">{transaction.reason}</DetailRow>
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
