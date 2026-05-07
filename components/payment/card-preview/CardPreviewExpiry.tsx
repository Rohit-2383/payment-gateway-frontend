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
    <div className="flex min-w-0 shrink flex-col items-start gap-0.5 sm:gap-1 md:items-end">
      <p className="text-[0.55rem] font-medium tracking-widest text-zinc-400 sm:text-[0.7rem]">EXPIRES</p>
      <p className="font-mono text-xs tracking-wide sm:text-sm md:text-base">{displayExpiry}</p>
    </div>
  );
});
