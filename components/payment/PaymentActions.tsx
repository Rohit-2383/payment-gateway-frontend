"use client";

import { Button } from "@/components/ui/button";

const UI_TEXT = {
  submit: "Pay now",
  processing: "Processing...",
  retry: "Retry",
  reset: "Reset",
} as const;

export type PaymentActionsProps = {
  isProcessing: boolean;
  isSubmitDisabled: boolean;
  canRetry: boolean;
  onRetry: () => Promise<void> | void;
  onReset: () => void;
};

export function PaymentActions({
  isProcessing,
  isSubmitDisabled,
  canRetry,
  onRetry,
  onReset,
}: PaymentActionsProps) {
  return (
    <div className="flex flex-col gap-2 sm:items-end">
      <Button
        type="submit"
        disabled={isSubmitDisabled}
        aria-disabled={isSubmitDisabled}
        className="w-full sm:w-auto"
      >
        {isProcessing ? UI_TEXT.processing : UI_TEXT.submit}
      </Button>

      <div className="flex w-full gap-2 sm:w-auto sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          disabled={isProcessing}
          className="flex-1 sm:flex-none"
        >
          {UI_TEXT.reset}
        </Button>

        {canRetry ? (
          <Button
            type="button"
            variant="secondary"
            onClick={onRetry}
            disabled={isProcessing}
            className="flex-1 sm:flex-none"
          >
            {UI_TEXT.retry}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

