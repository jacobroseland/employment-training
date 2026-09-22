import type { Country } from '../CountryExplorer.types'
import CountryCard from './CountryCard'
import { describe, expect, jest, test } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const country: Country = {
  countryName: 'Testland',
  countryCode: 'TST',
  flagImage: 'https://example.com/testland-flag.png',
  flagAltText: 'Flag of Testland',
  capital: 'Test City',
  region: 'Europe',
  population: 1234567,
  languages: ['English', 'French'],
  currencies: ['Test Dollar (T$)'],
  timeZones: ['UTC+01:00'],
}

describe('CountryCard', () => {
  test('renders the country summary and requests that details open', async () => {
    const user = userEvent.setup()
    const onDetailsToggle = jest.fn()

    render(
      <CountryCard
        country={country}
        isDetailsExpanded={false}
        onDetailsToggle={onDetailsToggle}
      />,
    )

    expect(
      screen.getByRole('img', { name: 'Flag of Testland' }),
    ).toHaveAttribute('src', 'https://example.com/testland-flag.png')

    expect(
      screen.getByRole('heading', { name: 'Testland' }),
    ).toBeInTheDocument()

    expect(screen.getByText('Capital: Test City')).toBeInTheDocument()

    expect(screen.getByText('Population: 1,234,567')).toBeInTheDocument()

    const detailsButton = screen.getByRole('button', {
      name: 'Show details',
    })

    expect(detailsButton).toHaveAttribute('aria-expanded', 'false')
    expect(detailsButton).toHaveAttribute(
      'aria-controls',
      'country-details-TST',
    )

    expect(document.getElementById('country-details-TST')).toHaveAttribute(
      'hidden',
    )

    await user.click(detailsButton)

    expect(onDetailsToggle).toHaveBeenCalledWith('TST')
  })

  test('renders expanded fallback details when country information is missing', () => {
    render(
      <CountryCard
        country={{
          ...country,
          languages: [],
          currencies: [],
          timeZones: [],
        }}
        isDetailsExpanded={true}
        onDetailsToggle={jest.fn()}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Hide details' }),
    ).toHaveAttribute('aria-expanded', 'true')

    expect(document.getElementById('country-details-TST')).not.toHaveAttribute(
      'hidden',
    )

    expect(screen.getByText('No languages listed')).toBeVisible()
    expect(screen.getByText('No currencies listed')).toBeVisible()
    expect(screen.getByText('No time zones listed')).toBeVisible()
  })
})
