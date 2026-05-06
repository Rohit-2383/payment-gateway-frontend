"use client";

import { useEffect, useRef } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePaymentStore } from "@/store/paymentStore";
import { TransactionDetailsModalContent } from "./TransactionDetailsModalContent";

export { DetailRow } from "./DetailRow";
export { TransactionStatusBadge } from "./TransactionStatusBadge";

export function TransactionDetailsModal() {
  const selectedTransaction = usePaymentStore((s) => s.selectedTransaction);
  const setSelectedTransaction = usePaymentStore((s) => s.setSelectedTransaction);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (selectedTransaction) {
      closeBtnRef.current?.focus();
    }
  }, [selectedTransaction]);

  function handleOpenChange(open: boolean) {
    if (!open) setSelectedTransaction(null);
  }

  return (
    <Dialog open={selectedTransaction !== null} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        {selectedTransaction && (
          <TransactionDetailsModalContent
            transaction={selectedTransaction}
            closeBtnRef={closeBtnRef}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
