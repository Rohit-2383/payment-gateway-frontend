"use client";

import * as React from "react";

import { CARD_TYPES, CARD_TYPE_LABELS } from "@/constants/cards";
import { CardBrandIcon } from "@/components/payment/card-brand-icons";
import type { CardType } from "@/types/payment";
import { useCardPreviewContext } from "./CardPreviewContext";

function EmvChip() {
  return (
    <svg
      width="38"
      height="28"
      viewBox="0 0 38 28"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="chipGold" x1="0" y1="0" x2="38" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c8932a" />
          <stop offset="0.45" stopColor="#e8b84b" />
          <stop offset="1" stopColor="#b8811f" />
        </linearGradient>
      </defs>
      <rect width="38" height="28" rx="4" fill="url(#chipGold)" />
      <line x1="0" y1="9.3" x2="38" y2="9.3" stroke="rgba(0,0,0,0.18)" strokeWidth="0.6" />
      <line x1="0" y1="18.7" x2="38" y2="18.7" stroke="rgba(0,0,0,0.18)" strokeWidth="0.6" />
      <line x1="12.7" y1="0" x2="12.7" y2="28" stroke="rgba(0,0,0,0.18)" strokeWidth="0.6" />
      <line x1="25.3" y1="0" x2="25.3" y2="28" stroke="rgba(0,0,0,0.18)" strokeWidth="0.6" />
      <rect x="12.7" y="9.3" width="12.6" height="9.4" rx="1.5" fill="rgba(0,0,0,0.12)" />
    </svg>
  );
}

const BrandLogo = React.memo(function BrandLogo({ cardType }: { cardType: CardType }) {
  const knownTypes = [CARD_TYPES.VISA, CARD_TYPES.MASTERCARD, CARD_TYPES.AMEX] as const;
  if ((knownTypes as readonly string[]).includes(cardType)) {
    return <CardBrandIcon cardType={cardType} variant="preview" />;
  }

  return (
    <span className="rounded border border-zinc-400/30 bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-300">
      {CARD_TYPE_LABELS[cardType]}
    </span>
  );
});

export const CardPreviewBadge = React.memo(function CardPreviewBadge() {
  const { cardType } = useCardPreviewContext();

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.7rem] font-medium tracking-widest text-zinc-400 uppercase">
          Payment Card
        </p>
        <BrandLogo cardType={cardType} />
      </div>
      <EmvChip />
    </div>
  );
});
