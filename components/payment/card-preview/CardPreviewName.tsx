"use client";

import * as React from "react";

import { CARD_PREVIEW_PLACEHOLDERS } from "@/constants/cards";
import { useCardPreviewContext } from "./CardPreviewContext";

export const CardPreviewName = React.memo(function CardPreviewName() {
  const { cardholderName } = useCardPreviewContext();
  const trimmed = cardholderName.trim();
  const displayName =
    trimmed.length > 0 ? trimmed.toUpperCase() : CARD_PREVIEW_PLACEHOLDERS.cardholderName;

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <p className="text-[0.7rem] font-medium tracking-widest text-zinc-400">CARDHOLDER</p>
      <p className="truncate text-sm font-medium tracking-wide sm:text-base">{displayName}</p>
    </div>
  );
});
