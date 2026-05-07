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
    <p className="font-mono text-lg leading-none tracking-wider sm:text-xl">{displayNumber}</p>
  );
});
