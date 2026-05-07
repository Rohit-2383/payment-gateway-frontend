"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { CARD_TYPES, CARD_TYPE_LABELS } from "@/constants/cards";
import { useCardPreviewContext } from "./CardPreviewContext";

export const CardPreviewBadge = React.memo(function CardPreviewBadge() {
  const { cardType } = useCardPreviewContext();
  const typeLabel = CARD_TYPE_LABELS[cardType];
  const badgeVariant = cardType === CARD_TYPES.UNKNOWN ? "outline" : "secondary";

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium tracking-wide text-zinc-300">Payment Card</p>
        <p className="text-[0.72rem] text-zinc-400">Live preview</p>
      </div>
      <Badge variant={badgeVariant} className="border-zinc-400/20 bg-white/10 text-zinc-100">
        {typeLabel}
      </Badge>
    </div>
  );
});
