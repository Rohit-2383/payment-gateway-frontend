"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CardType } from "@/types/payment";
import { CARD_TYPES, CARD_TYPE_LABELS, CARD_PREVIEW_PLACEHOLDERS } from "@/constants/cards";
import { formatCardNumber, formatExpiry } from "@/utils/formatters";

export type CardPreviewProps = {
  cardholderName?: string;
  cardNumber?: string;
  expiry?: string;
  cardType?: CardType;
  className?: string;
};

function getSafeTrimmed(value: string | undefined): string {
  return (value ?? "").trim();
}

export function CardPreview({
  cardholderName,
  cardNumber,
  expiry,
  cardType = CARD_TYPES.UNKNOWN,
  className,
}: CardPreviewProps) {
  const trimmedNumber = getSafeTrimmed(cardNumber);
  const trimmedName = getSafeTrimmed(cardholderName);
  const trimmedExpiry = getSafeTrimmed(expiry);

  const displayNumber =
    trimmedNumber.length > 0 ? formatCardNumber(trimmedNumber) : CARD_PREVIEW_PLACEHOLDERS.cardNumber;

  const displayName =
    trimmedName.length > 0 ? trimmedName.toUpperCase() : CARD_PREVIEW_PLACEHOLDERS.cardholderName;

  const displayExpiry =
    trimmedExpiry.length > 0 ? formatExpiry(trimmedExpiry) : CARD_PREVIEW_PLACEHOLDERS.expiry;

  const typeLabel = CARD_TYPE_LABELS[cardType] ?? CARD_TYPE_LABELS[CARD_TYPES.UNKNOWN];
  const badgeVariant = cardType === CARD_TYPES.UNKNOWN ? "outline" : "secondary";

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-0 bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-800 text-zinc-50 shadow-sm ring-1 ring-zinc-950/10 dark:ring-zinc-50/10",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.10),transparent_40%)]" />
      <CardContent className="relative flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium tracking-wide text-zinc-300">
              Payment Card
            </p>
            <p className="text-[0.72rem] text-zinc-400">
              Live preview
            </p>
          </div>
          <Badge variant={badgeVariant} className="border-zinc-400/20 bg-white/10 text-zinc-100">
            {typeLabel}
          </Badge>
        </div>

        <p className="font-mono text-lg leading-none tracking-wider sm:text-xl">
          {displayNumber}
        </p>

        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-[0.7rem] font-medium tracking-widest text-zinc-400">
              CARDHOLDER
            </p>
            <p className="truncate text-sm font-medium tracking-wide sm:text-base">
              {displayName}
            </p>
          </div>

          <div className="flex flex-col items-start gap-1 md:items-end">
            <p className="text-[0.7rem] font-medium tracking-widest text-zinc-400">
              EXPIRES
            </p>
            <p className="font-mono text-sm tracking-wide sm:text-base">
              {displayExpiry}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
