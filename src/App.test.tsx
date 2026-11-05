import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'
import {ThemeProvider} from "./providers/ThemeProvider";
import {SegmentProvider} from "./providers/SegmentProvider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

describe('application layout', () => {
  it('renders the overview within the application shell', async () => {
      const queryClient = new QueryClient({
          defaultOptions: {
              queries: { retry: false },
          },
      })

      render(
          <QueryClientProvider client={queryClient}>
              <ThemeProvider>
                  <SegmentProvider>
                      <App />
                  </SegmentProvider>
              </ThemeProvider>
          </QueryClientProvider>,
      )

    const navigation = screen.getByRole('navigation', {
      name: 'Main navigation',
    })

    expect(
        within(navigation).getByRole('link', { name: 'Overview' }),
    ).toHaveAttribute('aria-current', 'page')

    const main = screen.getByRole('main')

      expect(
          await within(main).findByRole('heading', {
              level: 1,
              name: 'Good evening, Ava',
          }),
      ).toBeInTheDocument()

    expect(
        within(main).getByRole('region', {
          name: 'Recent transactions',
        }),
    ).toBeInTheDocument()
  })
})