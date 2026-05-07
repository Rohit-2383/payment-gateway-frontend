"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { TRANSACTION_STATUS_CLASSES } from "@/constants/payment";
import { useTransactionModalContext } from "./TransactionModalContext";

export const TransactionStatusBadge = React.memo(function TransactionStatusBadge() {
  const { transaction } = useTransactionModalContext();
  const { status } = transaction;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        TRANSACTION_STATUS_CLASSES[status]
      )}
    >
      {status}
    </span>
  );
});
