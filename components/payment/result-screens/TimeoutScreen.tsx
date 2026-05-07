"use client";

import * as React from "react";
import { Clock } from "lucide-react";

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
            i < count ? "bg-warning" : "bg-border-strong"
          )}
        />
      ))}
    </div>
  );
}

export type TimeoutScreenProps = {
  transaction: Transaction;
  attemptText: string | null;
  canRetry: boolean;
  onRetry: () => Promise<void> | void;
  onReset: () => void;
};

export const TimeoutScreen = React.memo(function TimeoutScreen({
  transaction,
  attemptText,
  canRetry,
  onRetry,
  onReset,
}: TimeoutScreenProps) {
  const headingRef = React.useRef<HTMLHeadingElement>(null);

  React.useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="animate-result-enter flex flex-col items-center gap-5 py-2 text-center">
      <div className="relative animate-scale-enter">
        <div className="animate-pulse-ring absolute inset-0 rounded-full bg-warning/15" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-warning-subtle">
          <Clock
            className="text-warning-fg"
            size={32}
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
          Request Timed Out
        </h3>
        {transaction.retryCount > 0 && (
          <AttemptDots count={transaction.retryCount} max={MAX_RETRY_ATTEMPTS} />
        )}
        {attemptText && (
          <p className="text-sm font-medium text-muted-foreground">{attemptText}</p>
        )}
      </div>

      <p className="max-w-sm text-sm text-muted-foreground">
        The payment provider did not respond in time. Your card was not charged.
      </p>

      {!canRetry && (
        <p className="max-w-sm rounded-lg border border-warning/25 bg-warning-subtle px-4 py-3 text-sm text-warning-fg">
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
