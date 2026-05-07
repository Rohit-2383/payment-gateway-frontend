"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type TransactionDetailRowProps = {
  label: string;
  value: string;
  mono?: boolean;
};

export const TransactionDetailRow = React.memo(function TransactionDetailRow({
  label,
  value,
  mono = false,
}: TransactionDetailRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-2.5 last:border-b-0">
      <span className="shrink-0 text-sm font-medium text-muted-foreground">{label}</span>
      <span className={cn("text-right text-sm text-foreground", mono && "break-all font-mono")}>
        {value}
      </span>
    </div>
  );
});
