import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('application layout', () => {
  it('renders the overview within the application shell', () => {
    render(<App />)

    const navigation = screen.getByRole('navigation', {
      name: 'Main navigation',
    })

    expect(
        within(navigation).getByRole('link', { name: 'Overview' }),
    ).toHaveAttribute('aria-current', 'page')

    const main = screen.getByRole('main')

    expect(
        within(main).getByRole('heading', {
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