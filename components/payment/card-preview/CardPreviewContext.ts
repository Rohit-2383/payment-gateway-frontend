"use client";

import * as React from "react";
import type { CardType } from "@/types/payment";

export type CardPreviewContextValue = {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cardType: CardType;
};

export const CardPreviewContext = React.createContext<CardPreviewContextValue | null>(null);

export function useCardPreviewContext(): CardPreviewContextValue {
  const ctx = React.useContext(CardPreviewContext);
  if (ctx === null) {
    throw new Error("useCardPreviewContext must be used within a CardPreviewRoot");
  }
  return ctx;
}
