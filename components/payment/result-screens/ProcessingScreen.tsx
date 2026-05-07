"use client";

import * as React from "react";

export type ProcessingScreenProps = {
  isSlowNetwork: boolean;
};

function DualRingSpinner() {
  return (
    <div className="relative animate-scale-enter">
      <div className="animate-pulse-ring absolute inset-0 rounded-full bg-brand/15" />
      <div className="relative flex h-16 w-16 items-center justify-center">
        <svg
          className="animate-spin"
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          aria-label="Processing payment"
          role="status"
        >
          <circle
            cx="32"
            cy="32"
            r="26"
            stroke="currentColor"
            strokeOpacity="0.12"
            strokeWidth="4"
            className="text-brand"
          />
          <circle
            cx="32"
            cy="32"
            r="26"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="42 122"
            strokeDashoffset="20"
            transform="rotate(-90 32 32)"
            className="text-brand"
          />
        </svg>
      </div>
    </div>
  );
}

export const ProcessingScreen = React.memo(function ProcessingScreen({
  isSlowNetwork,
}: ProcessingScreenProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-2 text-center">
      <DualRingSpinner />

      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-semibold">Processing Payment...</h3>
        <p className="text-sm text-muted-foreground">
          Please do not refresh or close this window.
        </p>
        {isSlowNetwork && (
          <p className="mt-1 text-sm font-medium text-warning-fg">
            This is taking longer than usual...
          </p>
        )}
      </div>
    </div>
  );
});
