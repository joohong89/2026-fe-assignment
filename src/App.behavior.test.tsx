import { StrictMode } from 'react'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import {
    cleanup,
    render,
    screen,
    waitFor,
    within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import App from './App'
import { ThemeProvider } from './providers/ThemeProvider'
import { SegmentProvider } from './providers/SegmentProvider'
import { formatMoney } from './lib/format'
import { server } from './test/setup'

const clients: QueryClient[] = []
const dialogPrototype = HTMLDialogElement.prototype
const originalShowModal = Object.getOwnPropertyDescriptor(
    dialogPrototype,
    'showModal',
)
const originalClose = Object.getOwnPropertyDescriptor(dialogPrototype, 'close')

// jsdom needs basic dialog methods for form interactions. This shim does not
// test native focus containment, Escape handling or visual layout.
beforeAll(() => {
    Object.defineProperty(dialogPrototype, 'showModal', {
        configurable: true,
        value(this: HTMLDialogElement) {
            this.setAttribute('open', '')
        },
    })

    Object.defineProperty(dialogPrototype, 'close', {
        configurable: true,
        value(this: HTMLDialogElement) {
            this.removeAttribute('open')
            this.dispatchEvent(new Event('close'))
        },
    })
})

afterEach(() => {
    cleanup()
    clients.forEach((client) => client.clear())
    clients.length = 0
})

afterAll(() => {
    if (originalShowModal) {
        Object.defineProperty(dialogPrototype, 'showModal', originalShowModal)
    } else {
        Reflect.deleteProperty(dialogPrototype, 'showModal')
    }

    if (originalClose) {
        Object.defineProperty(dialogPrototype, 'close', originalClose)
    } else {
        Reflect.deleteProperty(dialogPrototype, 'close')
    }
})

function renderApp() {
    const client = new QueryClient({
        defaultOptions: {
            queries: { retry: false, staleTime: 30_000 },
            mutations: { retry: false },
        },
    })
    clients.push(client)

    render(
        <StrictMode>
            <QueryClientProvider client={client}>
                <ThemeProvider>
                    <SegmentProvider>
                        <App />
                    </SegmentProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </StrictMode>,
    )

    return userEvent.setup()
}

async function openAmountStep(user: ReturnType<typeof userEvent.setup>) {
    await screen.findByRole('heading', { name: 'Good evening, Ava' })
    await user.click(screen.getByRole('button', { name: 'New transfer' }))
    await user.click(await screen.findByRole('radio', { name: /Jamie Tan/ }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    await screen.findByRole('textbox', { name: 'Amount (SGD)' })
}

function expectMoney(container: HTMLElement, amount: number) {
    // Intl uses a non-breaking space after SGD; preserve it when matching.
    expect(
        within(container).getByText(formatMoney(amount), {
            normalizer: (text) => text,
        }),
    ).toBeInTheDocument()
}

describe('required dashboard and transfer behaviours', () => {
    it('rejects an amount above the balance without sending a transfer', async () => {
        let transferRequests = 0
        const countTransfers = ({ request }: { request: Request }) => {
            if (
                request.method === 'POST' &&
                new URL(request.url).pathname.endsWith('/api/transfers')
            ) {
                transferRequests += 1
            }
        }
        server.events.on('request:start', countTransfers)

        try {
            const user = renderApp()
            await openAmountStep(user)

            // The default checking account has SGD 4,280.55.
            await user.type(
                screen.getByRole('textbox', { name: 'Amount (SGD)' }),
                '4300',
            )
            await user.click(screen.getByRole('button', { name: 'Continue' }))

            expect(
                await screen.findByText(
                    /Amount can't be more than your available balance/,
                ),
            ).toBeInTheDocument()
            expect(
                screen.queryByRole('heading', { name: 'Check the details' }),
            ).not.toBeInTheDocument()
            expect(transferRequests).toBe(0)
        } finally {
            server.events.removeListener('request:start', countTransfers)
        }
    }, 10_000)

    it('shows transfer success and refreshes the dashboard', async () => {
        const user = renderApp()
        await openAmountStep(user)
        await user.type(
            screen.getByRole('textbox', { name: 'Amount (SGD)' }),
            '100',
        )
        await user.click(screen.getByRole('button', { name: 'Continue' }))
        await user.click(
            await screen.findByRole('button', { name: 'Confirm transfer' }),
        )

        expect(
            await screen.findByRole(
                'heading',
                { name: 'Transfer sent' },
                { timeout: 5000 },
            ),
        ).toBeInTheDocument()
        expect(screen.getByText(/^TRF-/)).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'Back to dashboard' }))
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

        await waitFor(() => {
            expectMoney(
                screen.getByRole('article', { name: 'Everyday Checking' }),
                4180.55,
            )
            expectMoney(
                screen.getByRole('region', { name: 'Total available' }),
                17020.55,
            )
            expectMoney(
                screen.getByRole('region', { name: 'Daily limit' }),
                4900,
            )

            const transactions = within(
                screen.getByRole('region', { name: 'Recent transactions' }),
            ).getAllByRole('listitem')
            expect(transactions).toHaveLength(8)
            expect(transactions[0]).toHaveTextContent('Jamie Tan')
            expect(transactions[0]).toHaveTextContent('-SGD 100.00')
        })
    }, 10_000)

    it('shows a dashboard request error and recovers through Retry', async () => {
        server.use(
            http.get('*/api/transactions', () =>
                HttpResponse.json(
                    {
                        error: {
                            code: 'INTERNAL_ERROR',
                            message: 'Temporary failure',
                        },
                    },
                    { status: 500 },
                ),
            ),
        )

        const user = renderApp()
        const section = screen.getByRole('region', {
            name: 'Recent transactions',
        })
        expect(await within(section).findByRole('alert')).toHaveTextContent(
            "We couldn't load your dashboard.",
        )

        // Restore the supplied handlers so the next GET succeeds.
        server.resetHandlers()
        await user.click(within(section).getByRole('button', { name: 'Retry' }))

        await waitFor(() => {
            expect(within(section).getAllByRole('listitem')).toHaveLength(8)
            expect(within(section).queryByRole('alert')).not.toBeInTheDocument()
        }, { timeout: 3000 })
        expect(within(section).getByText('FairPrice Finest')).toBeInTheDocument()
    }, 10_000)
})
