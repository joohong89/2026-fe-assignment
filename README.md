# Meridian Banking — Joo Hong Tan

**Live site:** https://fe-test-2026.joohong89.workers.dev/

**Run locally:** `npm install && npm run dev`  
**Run tests:** `npm test`

## Project structure

- `src/components/` — shared layout and UI components
- `src/features/` — dashboard, accounts, transactions and transfer flow
- `src/providers/` — theme and segment settings
- `src/api/` and `src/lib/` — API helpers, types and formatting
- `src/test/` — test setup

## Implementation decisions

- Fetch data through feature hooks at the page level and pass it to display components as props.
- Split transfers into recipient, amount, review and confirmation steps.
- Validate amounts against the available balance and daily limit, using integer cents for comparisons.
- Refresh customer, account and transaction data after a successful transfer. Disable automatic transfer retries to avoid duplicate submissions.
- Filter the eight loaded transactions in the browser. Search does not make additional API requests.
- Use the supplied design tokens for styling and save theme and segment preferences in `localStorage`.

## Loading and errors

- Dashboard sections show loading placeholders and a Retry action when an initial request fails.
- Empty lists and searches with no matches have separate messages. Search for `zzzz` to see the no-match state.
- Add `#fail` to a transfer note to simulate a failed submission. The entered details are kept for retry.
- A failed background refresh can currently replace dashboard data with an error message. The previous refresh-warning component is no longer in the code.

## Tests

- Reject a transfer above the available balance without sending a request.
- Confirm a successful transfer updates the dashboard.
- Recover from a failed data request using Retry.
- Check layout rendering and currency/date formatting.

## AI use

ChatGPT was used to help design the UI layout, generate React components, review code and draft tests. The generated code was integrated into the project and revised where needed to meet the requirements, including component structure, styling and API integration.

## Known issues

- Investigate API errors that sometimes appear after returning to an inactive browser tab.
- Keep previously loaded data visible when a background refresh fails.
