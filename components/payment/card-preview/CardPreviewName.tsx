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
    <div className="flex min-w-0 shrink flex-col gap-0.5 sm:gap-1">
      <p className="text-[0.55rem] font-medium tracking-widest text-zinc-400 sm:text-[0.7rem]">CARDHOLDER</p>
      <p className="truncate text-xs font-medium tracking-wide sm:text-sm md:text-base">{displayName}</p>
    </div>
  );
});
