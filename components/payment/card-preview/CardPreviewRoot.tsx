"use client";

import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CARD_TYPES } from "@/constants/cards";
import type { CardType } from "@/types/payment";
import { CardPreviewContext } from "./CardPreviewContext";

export type CardPreviewProps = {
  cardholderName?: string;
  cardNumber?: string;
  expiry?: string;
  cardType?: CardType;
  className?: string;
  children?: React.ReactNode;
};

export function CardPreviewRoot({
  cardholderName = "",
  cardNumber = "",
  expiry = "",
  cardType = CARD_TYPES.UNKNOWN,
  className,
  children,
}: CardPreviewProps) {
  const ctxValue = React.useMemo(
    () => ({ cardholderName, cardNumber, expiry, cardType }),
    [cardholderName, cardNumber, expiry, cardType]
  );

  return (
    <CardPreviewContext.Provider value={ctxValue}>
      <Card
        className={cn(
          "relative overflow-hidden border-0 bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-800 text-zinc-50 shadow-sm ring-1 ring-zinc-950/10 dark:ring-zinc-50/10",
          className
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.10),transparent_40%)]" />
        <CardContent className="relative flex flex-col gap-5 p-5 sm:p-6">
          {children}
        </CardContent>
      </Card>
    </CardPreviewContext.Provider>
  );
}
