import { TransactionDetailsModalRoot } from "./TransactionDetailsModalRoot";
import { TransactionDetailsModalContent } from "./TransactionDetailsModalContent";
import { TransactionStatusBadge } from "./TransactionStatusBadge";
import { TransactionDetailRow } from "./TransactionDetailRow";

export const TransactionDetailsModal = Object.assign(TransactionDetailsModalRoot, {
  Content: TransactionDetailsModalContent,
  StatusBadge: TransactionStatusBadge,
  DetailRow: TransactionDetailRow,
});
