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
          "relative aspect-[1.586/1] overflow-hidden border-0 bg-linear-to-br from-[#1a1f3a] via-[#2d1b4e] to-[#1a1a2e] text-zinc-50 shadow-xl ring-1 ring-black/20 transition-transform duration-300 hover:scale-[1.01]",
          className
        )}
      >
        {/* Subtle grid lines */}
        <div className="card-grid-overlay pointer-events-none absolute inset-0 opacity-60" />
        {/* Top holographic glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(147,129,255,0.18),transparent)]" />
        {/* Corner light reflection */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.10),transparent_38%)]" />
        <CardContent className="relative flex h-full flex-col justify-between p-5 sm:p-6">
          {children}
        </CardContent>
      </Card>
    </CardPreviewContext.Provider>
  );
}
