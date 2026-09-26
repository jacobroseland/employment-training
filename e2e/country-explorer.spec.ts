import { expect, type Page, test } from '@playwright/test'

type MockCountry = {
  name: string
  alpha3Code: string
  flags: {
    png: string
  }
  capital: string
  region: string
  population: number
  languages: {
    name: string
  }[]
  currencies: {
    name: string
    symbol?: string
  }[]
  timezones: string[]
}

const testland: MockCountry = {
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
}

const asialand: MockCountry = {
  ...testland,
  name: 'Asialand',
  alpha3Code: 'ASI',
  flags: {
    png: 'https://example.com/asialand-flag.png',
  },
  capital: 'Asia City',
  region: 'Asia',
}

const countriesForPagination: MockCountry[] = Array.from(
  { length: 13 },
  (_, index) => ({
    ...testland,
    name: `Country ${index + 1}`,
    alpha3Code: `C${String(index + 1).padStart(2, '0')}`,
    flags: {
      png: `https://example.com/country-${index + 1}-flag.png`,
    },
  }),
)

async function mockCountries(page: Page, countries: MockCountry[]) {
  await page.route(/https:\/\/countries\.dev\/countries\?fields=.*/, (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(countries),
    }),
  )
}

async function openCountryExplorer(page: Page) {
  await page.goto('/exercises/country-explorer')

  await expect(
    page.getByRole('searchbox', {
      name: 'Search for a country',
    }),
  ).toBeVisible()
}

test('searches for a country and shows its details', async ({ page }) => {
  await mockCountries(page, [testland])
  await openCountryExplorer(page)

  const searchInput = page.getByRole('searchbox', {
    name: 'Search for a country',
  })

  await searchInput.fill('Testland')
  await page.getByRole('button', { name: 'Search', exact: true }).click()

  await expect(page.getByRole('status')).toHaveText('Found 1 matching country.')

  await expect(
    page.getByRole('heading', { level: 3, name: 'Testland' }),
  ).toBeVisible()

  await page.getByRole('button', { name: 'Show details' }).click()

  await expect(
    page.getByRole('button', { name: 'Hide details' }),
  ).toHaveAttribute('aria-expanded', 'true')

  await expect(page.getByText('English')).toBeVisible()
})

test('shows an accessible validation error for an empty search', async ({
  page,
}) => {
  await mockCountries(page, [testland])
  await openCountryExplorer(page)

  const searchInput = page.getByRole('searchbox', {
    name: 'Search for a country',
  })

  await page.getByRole('button', { name: 'Search', exact: true }).click()

  await expect(page.getByRole('alert')).toHaveText(
    'Enter a country name to search.',
  )

  await expect(searchInput).toHaveAttribute('aria-invalid', 'true')
  await expect(searchInput).toHaveAttribute(
    'aria-describedby',
    'country-search-error',
  )
})

test('filters search results by region', async ({ page }) => {
  await mockCountries(page, [testland, asialand])
  await openCountryExplorer(page)

  await page
    .getByRole('searchbox', { name: 'Search for a country' })
    .fill('land')

  await page.getByRole('button', { name: 'Search', exact: true }).click()

  await expect(page.getByRole('status')).toHaveText(
    'Found 2 matching countries.',
  )

  await page
    .getByRole('combobox', { name: 'Filter by region' })
    .selectOption('Asia')

  await expect(page.getByRole('status')).toHaveText('Found 1 matching country.')

  await expect(
    page.getByRole('heading', { level: 3, name: 'Asialand' }),
  ).toBeVisible()

  await expect(
    page.getByRole('heading', { level: 3, name: 'Testland' }),
  ).toHaveCount(0)
})

test('loads another batch of matching countries', async ({ page }) => {
  await mockCountries(page, countriesForPagination)
  await openCountryExplorer(page)

  await page
    .getByRole('searchbox', { name: 'Search for a country' })
    .fill('Country')

  await page.getByRole('button', { name: 'Search', exact: true }).click()

  const countryHeadings = page.getByRole('heading', { level: 3 })

  await expect(countryHeadings).toHaveCount(12)

  await page.getByRole('button', { name: 'Load more countries' }).click()

  await expect(countryHeadings).toHaveCount(13)

  await expect(
    page.getByRole('button', { name: 'Load more countries' }),
  ).toHaveCount(0)
})
