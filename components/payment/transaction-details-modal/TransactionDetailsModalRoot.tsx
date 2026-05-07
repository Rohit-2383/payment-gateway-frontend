"use client";

import * as React from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePaymentStore } from "@/store/paymentStore";
import { TransactionModalContext } from "./TransactionModalContext";

export function TransactionDetailsModalRoot({
  children,
}: {
  children?: React.ReactNode;
}) {
  const selectedTransaction = usePaymentStore((s) => s.selectedTransaction);
  const setSelectedTransaction = usePaymentStore((s) => s.setSelectedTransaction);

  function handleOpenChange(open: boolean) {
    if (!open) setSelectedTransaction(null);
  }

  return (
    <Dialog open={selectedTransaction !== null} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90vh] gap-0 overflow-hidden p-0 sm:max-w-md sm:rounded-2xl"
      >
        {selectedTransaction !== null && (
          <TransactionModalContext.Provider value={{ transaction: selectedTransaction }}>
            {children}
          </TransactionModalContext.Provider>
        )}
      </DialogContent>
    </Dialog>
  );
}
