"use client";

import * as React from "react";
import { XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MAX_ATTEMPTS_MESSAGE, MAX_RETRY_ATTEMPTS } from "@/constants/payment";
import type { Transaction } from "@/types/payment";

function AttemptDots({ count, max }: { count: number; max: number }) {
  return (
    <div
      className="flex items-center gap-1.5"
      aria-label={`${count} of ${max} attempts used`}
    >
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className={cn(
            "h-2 w-2 rounded-full transition-colors",
            i < count ? "bg-danger" : "bg-border-strong"
          )}
        />
      ))}
    </div>
  );
}

export type FailedScreenProps = {
  transaction: Transaction;
  attemptText: string | null;
  canRetry: boolean;
  onRetry: () => Promise<void> | void;
  onReset: () => void;
};

export const FailedScreen = React.memo(function FailedScreen({
  transaction,
  attemptText,
  canRetry,
  onRetry,
  onReset,
}: FailedScreenProps) {
  const headingRef = React.useRef<HTMLHeadingElement>(null);

  React.useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="animate-result-enter flex flex-col items-center gap-5 py-2 text-center">
      <div className="relative animate-scale-enter">
        <div className="animate-pulse-ring absolute inset-0 rounded-full bg-danger/15" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-danger-subtle">
          <XCircle
            className="text-danger-fg"
            size={34}
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <h3
          ref={headingRef}
          tabIndex={-1}
          className="text-xl font-semibold outline-none"
        >
          Payment Failed
        </h3>
        {transaction.retryCount > 0 && (
          <AttemptDots count={transaction.retryCount} max={MAX_RETRY_ATTEMPTS} />
        )}
        {attemptText && (
          <p className="text-sm font-medium text-muted-foreground">{attemptText}</p>
        )}
      </div>

      {transaction.reason && (
        <p className="max-w-sm text-sm text-muted-foreground">{transaction.reason}</p>
      )}

      {!canRetry && (
        <p className="max-w-sm rounded-lg border border-danger/25 bg-danger-subtle px-4 py-3 text-sm text-danger-fg">
          {MAX_ATTEMPTS_MESSAGE}
        </p>
      )}

      <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
        <Button variant="outline" onClick={onReset} className="sm:w-auto">
          Reset
        </Button>
        {canRetry && (
          <Button onClick={onRetry} className="sm:w-auto">
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
});
