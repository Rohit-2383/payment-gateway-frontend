# Payment Gateway

A production-quality payment gateway simulation built with Next.js, TypeScript, and Zustand. Demonstrates real-world payment flow handling — validation, async lifecycle, retry logic, idempotency, and persisted transaction history — without using any third-party payment SDK.

## Live Demo

[Add deployment link here once deployed]

## Setup

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.

Requires Node 18+.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript (strict, zero `any`)
- Zustand 5 (state) with persist middleware
- React Hook Form + Zod (validation)
- Tailwind CSS v4 + shadcn/ui (styling primitives)
- CSS animations via tw-animate-css and custom keyframes (micro-interactions)

## Architecture

The application follows a strict layered architecture:

```
UI Components  →  Hooks (orchestration)  →  Utilities / Validators  →  API Layer
```

Core principles enforced across the codebase:

- No fetch calls inside components
- No business logic inside JSX
- No inline constants — all constants live in `constants/` by domain
- No magic strings — all `Record` keys are typed via shared types
- Single source of truth for shared logic (e.g. card type detection)
- Zustand selectors only — components never destructure the entire store

### Folder Structure

```
app/
  api/pay/route.ts                     Mock gateway route handler
  layout.tsx, page.tsx

components/
  payment/
    inputs/                            CardInput, CVVInput, ExpiryInput, AmountInput
    card-preview/                      Compound component (Root + Badge, Number, Name, Expiry)
    transaction-details-modal/         Compound component (Root + Content, StatusBadge, DetailRow)
    result-screens/                    SuccessScreen, FailedScreen, TimeoutScreen, ProcessingScreen
    card-brand-icons.tsx               Visa, Mastercard, Amex brand rendering
    PaymentLayout, PaymentForm, PaymentActions, StatusPanel,
    PaymentSummary, CardholderField, CurrencyField, TransactionHistory

constants/
  cards.ts                             Card types, lengths, labels
  currencies.ts                        Currencies and symbols
  payment.ts                           Status, retry caps, timeouts, status classes, UI text

hooks/
  usePayment.ts                        Lifecycle orchestration + retry
  usePaymentForm.ts                    Form bindings and watched values
  useCardDetection.ts                  Card type derivation from input value

store/
  paymentStore.ts                      Zustand store with persist

types/
  payment.ts                           Shared domain types

utils/
  formatters.ts                        Card / expiry / amount / timestamp formatting
  payment.ts                           API call + AbortController + error normalization

validators/
  card.ts                              Card type detection, Luhn check, length schema
  expiry.ts                            Expiry parsing, past date rejection, schema
  cvv.ts                               CVV schema (length depends on card type)
  amount.ts                            Amount schema
  schema.ts                            Composed paymentFormSchema
```

## Design Decisions

### Why Zustand over Redux Toolkit

Zustand was chosen for three reasons:

1. The state surface is small — payment status, current transaction, and history. Redux Toolkit's reducers, slices, and middleware add boilerplate without proportional value at this scope.
2. Built-in `persist` middleware handles localStorage persistence with a single line of config — no extra `redux-persist` setup. Only `transactions` is persisted; ephemeral UI state (processing status, slow-network flag) is excluded via `partialize`.
3. Selectors are first-class via the hook signature `usePaymentStore(s => s.x)`, which gives fine-grained re-renders without `useSelector` ceremony.

For a larger application with cross-cutting concerns and time-travel debugging needs, Redux Toolkit would be a stronger choice.

### Compound Components for CardPreview and Modal

`CardPreview` and `TransactionDetailsModal` use the compound component pattern. Each exposes a root component that owns context, and named sub-components that consume it:

```tsx
<CardPreview cardholderName={...} cardNumber={...} expiry={...} cardType={...}>
  <CardPreview.Badge />
  <CardPreview.Number />
  <CardPreview.Name />
  <CardPreview.Expiry />
</CardPreview>
```

This gives consumers explicit control over layout, makes each sub-part independently memoizable, and keeps each piece focused on a single concern.

### Validators Split by Domain

`validators/` is split into `card.ts`, `expiry.ts`, `cvv.ts`, `amount.ts`, and `schema.ts`. Each file owns one schema and the pure functions that support it. The composed `paymentFormSchema` lives in `schema.ts` and pulls from each domain file. This eliminates the bloat of a single mega-validator file and makes each piece independently testable.

### Single Source of Truth for Card Detection

`getCardTypeFromCardNumber` lives in `validators/card.ts` and covers Visa (prefix 4), Mastercard (51–55 and 2221–2720 two-series), and Amex (34, 37). `useCardDetection` imports from there rather than reimplementing detection. Card length and CVV length lookups go through `CARD_NUMBER_LENGTHS` and `CVV_LENGTHS` constants — no hardcoded numbers in business logic. The hook is consumed by `usePaymentForm`, which feeds both the card preview and the CVV input's `maxLength` prop.

### Luhn Validation

Card numbers are validated with the Luhn algorithm in `validators/card.ts` in addition to type-specific length checks. This rejects nonsense sequences that happen to be the right length, matching real payment form behaviour.

### Idempotency

A unique transaction ID is generated via `crypto.randomUUID()` before the first payment attempt. The same ID is reused on every retry for that payment. This guarantees:

- Transaction history contains one entry per payment, not one per attempt
- The mock gateway can deduplicate retries on the same logical transaction
- Retry count is tracked against the same record

### Timeout Handling

The frontend uses `AbortController` with a 6-second signal in `utils/payment.ts`. The mock backend simulates an 8-second response in 15% of cases — the frontend cancels these cleanly and surfaces a Timeout state. `AbortError` and `TypeError` (network failure) are caught separately from API-returned failures and given user-friendly messages. Raw error objects are never exposed to the UI.

### Double Submission Prevention

`handlePayment` short-circuits if status is already `processing`. The submit button is additionally disabled when:

- Form is invalid
- Status is `processing`
- Status is `success` (forces explicit reset before another payment)

## Functional Requirements Coverage

| Requirement                                                | Status |
| ---------------------------------------------------------- | ------ |
| Real-time per-field validation (on type and on blur)       | Done   |
| Submit disabled until form is fully valid                  | Done   |
| Card number auto-formatting every 4 digits                 | Done   |
| Card type detection (Visa, Mastercard, Amex)               | Done   |
| Luhn algorithm validation on card number                   | Done   |
| Expiry rejection of past dates                             | Done   |
| CVV length 3, or 4 for Amex                                | Done   |
| Currency selector (INR and USD)                            | Done   |
| Live card preview                                          | Done   |
| Full lifecycle (Idle, Processing, Success, Failed, Timeout)| Done   |
| 2-second processing state                                  | Done   |
| Distinct result screen per outcome                         | Done   |
| Mock gateway at `/api/pay` with 60/25/15 distribution      | Done   |
| 8-second simulated timeout responses                       | Done   |
| 6-second AbortController timeout on frontend               | Done   |
| Retry option on failed/timed-out payments                  | Done   |
| Max 3 retry attempts with attempt counter UI               | Done   |
| Final failure message after 3 attempts                     | Done   |
| Same transaction ID reused across retries                  | Done   |
| Transaction history with ID, amount, status, timestamp     | Done   |
| History persistence across page refreshes (localStorage)   | Done   |
| Click past transaction to view details                     | Done   |
| Idempotency via `crypto.randomUUID()`                      | Done   |
| TypeScript with no `any`                                   | Done   |
| Clean folder structure (components, hooks, utils, types)   | Done   |
| Network errors separate from API failures                  | Done   |
| Mobile (375px) and desktop (1280px) responsive             | Done   |
| Visible labels on every input                              | Done   |
| `aria-describedby` linking errors to inputs                | Done   |
| Focus management after state transitions                   | Done   |
| Double submission prevention                               | Done   |
| Slow network feedback (shown after 3 seconds)              | Done   |

## Assumptions

- The mock gateway is fully simulated via a Next.js Route Handler. No real payment provider is integrated.
- Transaction history is rendered as a section below the payment form. The PDF did not specify placement, so the primary action (payment) was kept prominent and history is accessible without taking visual priority.
- Currency symbols are resolved through the `CURRENCY_SYMBOLS` constant — never hardcoded inside components.
- "Slow network" is defined as a processing state lasting longer than 3 seconds. At that point, additional UI feedback is shown to the user.
- The retry counter starts at 1 for the first attempt. Users see "Attempt 1 of 3" on the initial attempt and "Attempt 3 of 3" on the final one.
- Only `transactions` is persisted to localStorage. Ephemeral state (current payment status, selected transaction, slow-network flag) is intentionally excluded so the UI always starts clean on reload while history is preserved.

## What I Would Improve Given More Time

- **Testing layer** — unit tests for every validator and formatter with Jest, plus end-to-end Playwright tests covering the full payment flow including success, retry exhaustion, timeout, and the terminal failure state after 3 attempts.
- **Observability** — Sentry integration for error monitoring, performance tracing, and session replay on failed payments to debug issues users actually hit in production.
- **Internationalisation** — locale-aware currency formatting and date display via `Intl.NumberFormat` and `Intl.DateTimeFormat`, plus support for additional currencies beyond INR and USD.
- **Resilience patterns** — exponential backoff on retries instead of immediate retry, and a `useDoubleSubmitGuard` hook that encapsulates the submission lock pattern for reuse across other forms in the codebase.
- **Idempotency hardening** — replace `crypto.randomUUID()` with ULIDs for sortable, URL-safe IDs that double as natural ordering keys in the transaction list.
- **UX refinements** — skeleton loaders during Zustand persist hydration, and a downloadable PDF receipt on the success screen.
- **Performance** — code-split the transaction details modal and result screens with `next/dynamic` to keep the initial bundle lean, since neither is needed on first paint.

## Commits

Each section was committed independently for clear history:

- feat: initialize Next.js payment gateway project structure
- feat: add payment types, constants, and Zustand store
- feat: implement payment lifecycle and gateway infrastructure
- refactor: implement component-driven payment architecture
- feat: implement transaction history with persistent rendering
- feat: implement transaction details modal
- feat: wire transaction history and modal into payment layout
- fix: mobile responsiveness and accessibility audit
- refactor: split constants into domain-focused modules
- refactor: split validators into single-responsibility files
- refactor: convert CardPreview to compound component pattern
- refactor: convert TransactionDetailsModal to compound component pattern
- style: refined design system, typography, animations and result screens
- docs: add comprehensive README