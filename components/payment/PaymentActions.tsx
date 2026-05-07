"use client";

import { Button } from "@/components/ui/button";
import type { PaymentStatus } from "@/types/payment";
import { PAYMENT_STATUS } from "@/constants/payment";

const UI_TEXT = {
  submit: "Pay now",
  processing: "Processing...",
  reset: "Reset",
} as const;

export type PaymentActionsProps = {
  isProcessing: boolean;
  isFormValid: boolean;
  status: PaymentStatus;
  onReset: () => void;
};

export function PaymentActions({
  isProcessing,
  isFormValid,
  status,
  onReset,
}: PaymentActionsProps) {
  const isSubmitDisabled =
    !isFormValid || isProcessing || status === PAYMENT_STATUS.SUCCESS;

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={onReset}
        disabled={isProcessing}
      >
        {UI_TEXT.reset}
      </Button>
      <Button
        type="submit"
        disabled={isSubmitDisabled}
        aria-disabled={isSubmitDisabled}
      >
        {isProcessing ? UI_TEXT.processing : UI_TEXT.submit}
      </Button>
    </div>
  );
}
