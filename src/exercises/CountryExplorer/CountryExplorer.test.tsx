import CountryExplorer, { type RestCountry } from './CountryExplorer'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const fetchMock = jest.fn<typeof fetch>()
const originalFetch = globalThis.fetch

const countries: RestCountry[] = [
  {
    name: 'Testland',
    alpha3Code: 'TST',
    flags: {
      png: 'https://example.com/testland-flag.png',
    },
    capital: 'Test City',
    region: 'Europe',
    population: 1234567,
    languages: [{ name: 'English' }],
    currencies: [{ name: 'Test Dollar', symbol: 'T$' }],
    timezones: ['UTC+01:00'],
  },
]

const countriesInMultipleRegions: RestCountry[] = [
  ...countries,
  {
    ...countries[0],
    name: 'Asialand',
    alpha3Code: 'ASI',
    flags: {
      png: 'https://example.com/asialand-flag.png',
    },
    capital: 'Asia City',
    region: 'Asia',
  },
]

const countriesForPagination: RestCountry[] = Array.from(
  { length: 13 },
  (_, index) => ({
    ...countries[0],
    name: `Country ${index + 1}`,
    alpha3Code: `C${String(index + 1).padStart(2, '0')}`,
    flags: {
      png: `https://example.com/country-${index + 1}-flag.png`,
    },
  }),
)

const countryWithIncompleteApiData: RestCountry = {
  name: 'Incomplete Land',
  alpha3Code: 'INC',
  flags: {
    png: 'https://example.com/incomplete-land-flag.png',
  },
  capital: '',
  region: 'Europe',
  population: 100,
  currencies: [{ name: 'Plain Dollar' }],
}

const countryWithoutCurrencies: RestCountry = {
  ...countryWithIncompleteApiData,
  name: 'Currencyless Land',
  alpha3Code: 'CUR',
  currencies: undefined,
}

function mockSuccessfulFetch(data: RestCountry[]) {
  fetchMock.mockResolvedValue({
    ok: true,
    json: async () => data,
  } as Response)
}

function mockFailedFetch() {
  fetchMock.mockResolvedValue({
    ok: false,
  } as Response)
}

beforeEach(() => {
  fetchMock.mockReset()
  globalThis.fetch = fetchMock
})

afterEach(() => {
  globalThis.fetch = originalFetch
})

describe('CountryExplorer', () => {
  test('loads countries and renders a matching search result', async () => {
    mockSuccessfulFetch(countries)

    const user = userEvent.setup()

    render(<CountryExplorer />)

    expect(screen.getByText('Loading countries…')).toBeInTheDocument()

    expect(
      await screen.findByRole('button', { name: 'Search' }),
    ).toBeInTheDocument()

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('https://countries.dev/countries?fields='),
    )

    const searchInput = screen.getByRole('searchbox', {
      name: 'Search for a country',
    })

    await user.type(searchInput, '  Testland  ')
    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(searchInput).toHaveValue('Testland')

    expect(screen.getByRole('status')).toHaveTextContent(
      'Found 1 matching country.',
    )

    expect(
      screen.getByRole('heading', { level: 3, name: 'Testland' }),
    ).toBeInTheDocument()
  })

  test('shows an error when the API response is unsuccessful', async () => {
    mockFailedFetch()

    render(<CountryExplorer />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Unable to load countries. Please try again.',
    )

    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
  })

  test('shows an accessible validation error for an empty search', async () => {
    mockSuccessfulFetch(countries)

    const user = userEvent.setup()

    render(<CountryExplorer />)

    const searchInput = await screen.findByRole('searchbox', {
      name: 'Search for a country',
    })

    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Enter a country name to search.',
    )

    expect(searchInput).toHaveAttribute('aria-invalid', 'true')

    expect(searchInput).toHaveAttribute(
      'aria-describedby',
      'country-search-error',
    )
  })

  test('filters matching countries by region', async () => {
    mockSuccessfulFetch(countriesInMultipleRegions)

    const user = userEvent.setup()

    render(<CountryExplorer />)

    const searchInput = await screen.findByRole('searchbox', {
      name: 'Search for a country',
    })

    await user.type(searchInput, 'land')
    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(screen.getByRole('status')).toHaveTextContent(
      'Found 2 matching countries.',
    )

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Filter by region' }),
      'Asia',
    )

    expect(screen.getByRole('status')).toHaveTextContent(
      'Found 1 matching country.',
    )

    expect(
      screen.getByRole('heading', { level: 3, name: 'Asialand' }),
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('heading', { level: 3, name: 'Testland' }),
    ).not.toBeInTheDocument()
  })

  test('expands and collapses a country details panel', async () => {
    mockSuccessfulFetch(countries)

    const user = userEvent.setup()

    render(<CountryExplorer />)

    const searchInput = await screen.findByRole('searchbox', {
      name: 'Search for a country',
    })

    await user.type(searchInput, 'Testland')
    await user.click(screen.getByRole('button', { name: 'Search' }))

    await user.click(screen.getByRole('button', { name: 'Show details' }))

    expect(
      screen.getByRole('button', { name: 'Hide details' }),
    ).toHaveAttribute('aria-expanded', 'true')

    expect(screen.getByText('English')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Hide details' }))

    expect(
      screen.getByRole('button', { name: 'Show details' }),
    ).toHaveAttribute('aria-expanded', 'false')

    expect(screen.getByText('English')).not.toBeVisible()
  })

  test('loads another batch of matching countries', async () => {
    mockSuccessfulFetch(countriesForPagination)

    const user = userEvent.setup()

    render(<CountryExplorer />)

    const searchInput = await screen.findByRole('searchbox', {
      name: 'Search for a country',
    })

    await user.type(searchInput, 'Country')
    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(screen.getAllByRole('listitem')).toHaveLength(12)

    await user.click(
      screen.getByRole('button', { name: 'Load more countries' }),
    )

    expect(screen.getAllByRole('listitem')).toHaveLength(13)

    expect(
      screen.queryByRole('button', { name: 'Load more countries' }),
    ).not.toBeInTheDocument()
  })

  test('maps missing API fields to readable fallback content', async () => {
    mockSuccessfulFetch([countryWithIncompleteApiData])

    const user = userEvent.setup()

    render(<CountryExplorer />)

    const searchInput = await screen.findByRole('searchbox', {
      name: 'Search for a country',
    })

    await user.type(searchInput, 'Incomplete Land')
    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(screen.getByText('Capital: No capital listed')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Show details' }))

    expect(screen.getByText('No languages listed')).toBeVisible()
    expect(screen.getByText('Plain Dollar')).toBeVisible()
    expect(screen.getByText('No time zones listed')).toBeVisible()
  })

  test('shows a fallback message for a non-Error fetch rejection', async () => {
    fetchMock.mockRejectedValue('Unexpected failure')

    render(<CountryExplorer />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'An unexpected error occurred while loading countries.',
    )
  })

  test('handles an omitted currency collection from the API', async () => {
    mockSuccessfulFetch([countryWithoutCurrencies])

    const user = userEvent.setup()

    render(<CountryExplorer />)

    const searchInput = await screen.findByRole('searchbox', {
      name: 'Search for a country',
    })

    await user.type(searchInput, 'Currencyless Land')
    await user.click(screen.getByRole('button', { name: 'Search' }))

    await user.click(screen.getByRole('button', { name: 'Show details' }))

    expect(screen.getByText('No currencies listed')).toBeVisible()
  })
})
