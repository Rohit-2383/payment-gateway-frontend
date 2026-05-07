"use client";

import * as React from "react";

import { CARD_PREVIEW_PLACEHOLDERS } from "@/constants/cards";
import { formatExpiry } from "@/utils/formatters";
import { useCardPreviewContext } from "./CardPreviewContext";

export const CardPreviewExpiry = React.memo(function CardPreviewExpiry() {
  const { expiry } = useCardPreviewContext();
  const trimmed = expiry.trim();
  const displayExpiry =
    trimmed.length > 0 ? formatExpiry(trimmed) : CARD_PREVIEW_PLACEHOLDERS.expiry;

  return (
    <div className="flex flex-col items-start gap-1 md:items-end">
      <p className="text-[0.7rem] font-medium tracking-widest text-zinc-400">EXPIRES</p>
      <p className="font-mono text-sm tracking-wide sm:text-base">{displayExpiry}</p>
    </div>
  );
});
