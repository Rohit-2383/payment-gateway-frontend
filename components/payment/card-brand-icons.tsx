"use client";

import * as React from "react";

import { CARD_TYPES } from "@/constants/cards";
import type { CardType } from "@/types/payment";

// ---------------------------------------------------------------------------
// Preview icons — rendered on the dark card background (larger, decorative)
// ---------------------------------------------------------------------------

export const VisaPreviewIcon = React.memo(function VisaPreviewIcon() {
  return (
    <svg
      width="60"
      height="22"
      viewBox="0 0 60 22"
      fill="none"
      aria-label="Visa"
    >
      <text
        x="1"
        y="19"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="22"
        fontWeight="900"
        fontStyle="italic"
        fill="white"
      >
        VISA
      </text>
    </svg>
  );
});

export const MastercardPreviewIcon = React.memo(function MastercardPreviewIcon() {
  // Two circles: left C1(16,15) r=14, right C2(30,15) r=14
  // Lens intersections at (23, 2.9) and (23, 27.1)
  // Arc angle at each center = 120° → large-arc-flag = 0
  // Sweep from top→bottom along C1 right side = clockwise (sweep=1)
  // Sweep from bottom→top along C2 left side = counter-clockwise (sweep=0)
  return (
    <svg
      width="46"
      height="30"
      viewBox="0 0 46 30"
      fill="none"
      aria-label="Mastercard"
    >
      <circle cx="16" cy="15" r="14" fill="#EB001B" />
      <circle cx="30" cy="15" r="14" fill="#F79E1B" />
      <path
        d="M 23 2.9 A 14 14 0 0 1 23 27.1 A 14 14 0 0 0 23 2.9 Z"
        fill="#FF5F00"
      />
    </svg>
  );
});

export const AmexPreviewIcon = React.memo(function AmexPreviewIcon() {
  return (
    <svg
      width="62"
      height="22"
      viewBox="0 0 62 22"
      fill="none"
      aria-label="American Express"
    >
      <rect width="62" height="22" rx="4" fill="#2E77BC" />
      <text
        x="31"
        y="16"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="10"
        fontWeight="bold"
        fill="white"
        letterSpacing="2"
      >
        AMEX
      </text>
    </svg>
  );
});

// ---------------------------------------------------------------------------
// Badge icons — rendered inside the card number input field (compact)
// ---------------------------------------------------------------------------

export const VisaBadgeIcon = React.memo(function VisaBadgeIcon() {
  return (
    <svg
      width="36"
      height="22"
      viewBox="0 0 36 22"
      fill="none"
      aria-label="Visa"
    >
      <rect width="36" height="22" rx="3" fill="#1A1F71" />
      <text
        x="18"
        y="16"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="12"
        fontWeight="900"
        fontStyle="italic"
        fill="white"
      >
        VISA
      </text>
    </svg>
  );
});

export const MastercardBadgeIcon = React.memo(function MastercardBadgeIcon() {
  // Two circles: left C1(11,11) r=10, right C2(21,11) r=10
  // Lens intersections at (16, 2.34) and (16, 19.66)
  // Arc angle = 120° → large-arc-flag = 0
  return (
    <svg
      width="32"
      height="22"
      viewBox="0 0 32 22"
      fill="none"
      aria-label="Mastercard"
    >
      <circle cx="11" cy="11" r="10" fill="#EB001B" />
      <circle cx="21" cy="11" r="10" fill="#F79E1B" />
      <path
        d="M 16 2.34 A 10 10 0 0 1 16 19.66 A 10 10 0 0 0 16 2.34 Z"
        fill="#FF5F00"
      />
    </svg>
  );
});

export const AmexBadgeIcon = React.memo(function AmexBadgeIcon() {
  return (
    <svg
      width="36"
      height="22"
      viewBox="0 0 36 22"
      fill="none"
      aria-label="American Express"
    >
      <rect width="36" height="22" rx="3" fill="#2E77BC" />
      <text
        x="18"
        y="15"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="8"
        fontWeight="bold"
        fill="white"
        letterSpacing="1"
      >
        AMEX
      </text>
    </svg>
  );
});

// ---------------------------------------------------------------------------
// Convenience components — pick the right icon based on cardType + variant
// ---------------------------------------------------------------------------

export type CardBrandIconVariant = "preview" | "badge";

export type CardBrandIconProps = {
  cardType: CardType;
  variant: CardBrandIconVariant;
};

export const CardBrandIcon = React.memo(function CardBrandIcon({
  cardType,
  variant,
}: CardBrandIconProps) {
  if (cardType === CARD_TYPES.VISA) {
    return variant === "preview" ? <VisaPreviewIcon /> : <VisaBadgeIcon />;
  }
  if (cardType === CARD_TYPES.MASTERCARD) {
    return variant === "preview" ? <MastercardPreviewIcon /> : <MastercardBadgeIcon />;
  }
  if (cardType === CARD_TYPES.AMEX) {
    return variant === "preview" ? <AmexPreviewIcon /> : <AmexBadgeIcon />;
  }
  return null;
});
