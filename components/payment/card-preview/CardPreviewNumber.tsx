"use client";

import * as React from "react";

import { CARD_PREVIEW_PLACEHOLDERS } from "@/constants/cards";
import { formatCardNumber } from "@/utils/formatters";
import { useCardPreviewContext } from "./CardPreviewContext";

export const CardPreviewNumber = React.memo(function CardPreviewNumber() {
  const { cardNumber } = useCardPreviewContext();
  const trimmed = cardNumber.trim();
  const displayNumber =
    trimmed.length > 0 ? formatCardNumber(trimmed) : CARD_PREVIEW_PLACEHOLDERS.cardNumber;

  return (
    <p className="font-mono text-sm leading-tight tracking-wide sm:text-lg sm:leading-none sm:tracking-wider md:text-xl">
      {displayNumber}
    </p>
  );
});
