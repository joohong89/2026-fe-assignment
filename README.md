# Meridian Banking — Joo Hong Tan

- Deployed: https://fe-test-2026.joohong89.workers.dev/
- Run locally: `npm install && npm run dev`

## Project structure

- `src/components/`: layout and shared UI.
- `src/features/`: domain API/query hooks, dashboard and transfer forms.
- `src/providers/`: theme and segment Context.
- `src/api/`, `src/lib/`: request types/helpers and formatters.
- `src/mocks/`, `mock-api/`, `src/test/`: supplied mock API and test setup.

## Decisions and trade-offs

The libraries and design tokens came with the starter.

- TanStack Query manages API state; React state and React Hook Form manage UI and form state.
- Domain-based queries run at page level; display components receive props.
- Zod validates recipient fields, amount precision, balance and daily-limit constraints. Amount comparisons use integer cents.
- Local search filters only the eight loaded transactions, avoiding additional requests.
- Successful transfers invalidate customer, accounts and transactions queries. Mutation retries are disabled to avoid duplicate transfers.
- CSS files consume design tokens; local storage persists appearance selections.

## Loading, empty and error states

- Loading placeholders; empty-list messages; initial errors with Retry.
- Cached data remains visible after refresh failures, with warning and Retry.
- Enter `zzzz` in search for no results; `#fail` in the transfer note for submission failure. Failed transfers preserve form data.

## Tests

Behaviour tests reviewed cover over-balance rejection without a POST, successful transfer/dashboard refresh, failed-request recovery and duplicate-submission prevention. Layout and formatter tests cover rendering and SGD/Singapore date output.

## AI use

ChatGPT assisted with implementation, review and test drafts. Corrections requested:

1. Move API access from display components to domain hooks called by the page.
2. Replace inline styles with CSS and extract the shared refresh warning.
3. Align desktop search beside the transactions heading, as shown in the wireframe.

## Not done / known issues

Future improvements: debounced server-side search, a CSS/UI library if needed, and i18n. These are not implemented.
