const CARD_NUMBER_MAX_LENGTH_DEFAULT = 16;
const CARD_NUMBER_MAX_LENGTH_AMEX = 15;

const CARD_NUMBER_GROUP_SIZE_DEFAULT = 4;

const AMEX_PREFIXES = ["34", "37"] as const;

export function sanitizeCardNumber(value: string): string {
  return value.replaceAll(/\D/g, "");
}

function isAmexCardNumber(digits: string): boolean {
  return AMEX_PREFIXES.some((prefix) => digits.startsWith(prefix));
}

function chunkString(value: string, chunkSize: number): string[] {
  const chunks: string[] = [];
  for (let index = 0; index < value.length; index += chunkSize) {
    chunks.push(value.slice(index, index + chunkSize));
  }
  return chunks;
}

export function formatCardNumber(value: string): string {
  const digitsOnly = sanitizeCardNumber(value);
  const isAmex = isAmexCardNumber(digitsOnly);

  const maxLength = isAmex
    ? CARD_NUMBER_MAX_LENGTH_AMEX
    : CARD_NUMBER_MAX_LENGTH_DEFAULT;

  const digits = digitsOnly.slice(0, maxLength);

  if (digits.length === 0) return "";

  if (isAmex) {
    const part1 = digits.slice(0, 4);
    const part2 = digits.slice(4, 10);
    const part3 = digits.slice(10, 15);
    return [part1, part2, part3].filter((p) => p.length > 0).join(" ").trim();
  }

  return chunkString(digits, CARD_NUMBER_GROUP_SIZE_DEFAULT).join(" ").trim();
}

const TRANSACTION_ID_DISPLAY_LENGTH = 8;

export function truncateTransactionId(id: string): string {
  return id.length > TRANSACTION_ID_DISPLAY_LENGTH
    ? `${id.slice(0, TRANSACTION_ID_DISPLAY_LENGTH)}…`
    : id;
}

export function formatTransactionTimestamp(iso: string): string {
  const date = new Date(iso);
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

export function formatTransactionTimestampFull(iso: string): string {
  const date = new Date(iso);
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
}

const EXPIRY_MAX_DIGITS = 4; // MMYY
const EXPIRY_SLASH_INDEX = 2;

function clampMonth(month: number): number {
  if (!Number.isFinite(month)) return 1;
  if (month <= 0) return 1;
  if (month > 12) return 12;
  return month;
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function formatExpiry(value: string): string {
  const digits = value.replaceAll(/\D/g, "").slice(0, EXPIRY_MAX_DIGITS);

  if (digits.length === 0) return "";

  if (digits.length === 1) {
    const first = digits[0] ?? "";
    if (first >= "2" && first <= "9") {
      return `0${first}/`;
    }
    return first;
  }

  const rawMonth = digits.slice(0, EXPIRY_SLASH_INDEX);
  const monthNumber = clampMonth(Number(rawMonth));
  const month = pad2(monthNumber);

  const year = digits.slice(EXPIRY_SLASH_INDEX, EXPIRY_MAX_DIGITS);
  if (year.length === 0) return month;

  return `${month}/${year}`;
}
