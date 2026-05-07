import { CardPreviewRoot } from "./CardPreviewRoot";
import { CardPreviewBadge } from "./CardPreviewBadge";
import { CardPreviewExpiry } from "./CardPreviewExpiry";
import { CardPreviewName } from "./CardPreviewName";
import { CardPreviewNumber } from "./CardPreviewNumber";

export const CardPreview = Object.assign(CardPreviewRoot, {
  Badge: CardPreviewBadge,
  Expiry: CardPreviewExpiry,
  Name: CardPreviewName,
  Number: CardPreviewNumber,
});

export type { CardPreviewProps } from "./CardPreviewRoot";
