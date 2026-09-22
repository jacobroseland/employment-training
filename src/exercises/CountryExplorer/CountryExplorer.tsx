import './CountryExplorer.css'
import CountryCard from './components/CountryCard'
import type { Country } from './CountryExplorer.types'
import { useEffect, useState } from 'react'

// Constants
const COUNTRY_BATCH_SIZE = 12

// Types
export type RestCountry = {
  name: string
  alpha3Code: string
  flags: {
    png: string
  }
  capital: string
  region: string
  population: number
  languages?: {
    name: string
  }[]
  currencies?: {
    name: string
    symbol?: string
  }[]
  timezones?: string[]
}

// Data transformation helper
function toCountry(country: RestCountry): Country {
  return {
    countryName: country.name,
    countryCode: country.alpha3Code,
    flagImage: country.flags.png,
    flagAltText: `Flag of ${country.name}`,
    capital: country.capital || 'No capital listed',
    region: country.region,
    population: country.population,
    languages: (country.languages ?? []).map((language) => language.name),
    currencies: (country.currencies ?? []).map((currency) => {
      return currency.symbol
        ? `${currency.name} (${currency.symbol})`
        : currency.name
    }),
    timeZones: country.timezones ?? [],
  }
}

function CountryExplorer() {
  // Component state
  const [searchInput, setSearchInput] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [submittedSearch, setSubmittedSearch] = useState('')
  const [searchError, setSearchError] = useState<string | null>(null)

  const [visibleCountryCount, setVisibleCountryCount] =
    useState(COUNTRY_BATCH_SIZE)
  const [countries, setCountries] = useState<Country[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const [expandedCountryCode, setExpandedCountryCode] = useState<string | null>(
    null,
  )

  // Derived values
  const normalizedSearch = submittedSearch.toLocaleLowerCase()

  const filteredCountries = countries.filter((country) => {
    const matchesSearch = country.countryName
      .toLowerCase()
      .includes(normalizedSearch)

    const matchesRegion =
      selectedRegion === 'all' || country.region === selectedRegion

    return matchesSearch && matchesRegion
  })

  const visibleCountries = filteredCountries.slice(0, visibleCountryCount)

  const hasMoreCountries = visibleCountries.length < filteredCountries.length

  // Effects
  useEffect(() => {
    async function loadCountries() {
      try {
        setIsLoading(true)
        setFetchError(null)

        const response = await fetch(
          'https://countries.dev/countries?fields=name,alpha3Code,flags,capital,region,population,languages,currencies,timezones',
        )

        if (!response.ok) {
          throw new Error('Unable to load countries. Please try again.')
        }

        const data: RestCountry[] = await response.json()
        const formattedCountries = data.map(toCountry)

        setCountries(formattedCountries)
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred while loading countries.'

        setFetchError(message)
      } finally {
        setIsLoading(false)
      }
    }

    loadCountries()
  }, [])

  // Event handlers
  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchInput(event.target.value)
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedSearch = searchInput.trim()

    if (!trimmedSearch) {
      setSearchError('Enter a country name to search.')
      return
    }

    setSearchError(null)
    setSearchInput(trimmedSearch)
    setSubmittedSearch(trimmedSearch)
    setVisibleCountryCount(COUNTRY_BATCH_SIZE)
  }

  function handleRegionChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedRegion(event.target.value)
    setVisibleCountryCount(COUNTRY_BATCH_SIZE)
  }

  function handleDetailsToggle(countryCode: string) {
    setExpandedCountryCode((currentCountryCode) =>
      currentCountryCode === countryCode ? null : countryCode,
    )
  }

  function handleLoadMore() {
    setVisibleCountryCount((currentCount) => {
      return currentCount + COUNTRY_BATCH_SIZE
    })
  }

  // JSX
  return (
    <>
      <section
        className="country-explorer"
        aria-labelledby="country-explorer-heading"
      >
        <h2 id="country-explorer-heading" className="exercise-title">
          Country Explorer
        </h2>
        {!isLoading && (
          <form
            className="country-search-form"
            noValidate
            onSubmit={handleSearchSubmit}
          >
            <div className="field">
              <label htmlFor="country-search">Search for a country</label>

              <input
                id="country-search"
                type="search"
                value={searchInput}
                onChange={handleSearchChange}
                aria-invalid={Boolean(searchError)}
                aria-describedby={
                  searchError ? 'country-search-error' : undefined
                }
              />

              {searchError && (
                <p id="country-search-error" role="alert">
                  {searchError}
                </p>
              )}
            </div>

            <div className="field">
              <label htmlFor="region-filter">Filter by region</label>

              <select
                id="region-filter"
                value={selectedRegion}
                onChange={handleRegionChange}
              >
                <option value="all">All regions</option>
                <option value="Africa">Africa</option>
                <option value="Americas">Americas</option>
                <option value="Asia">Asia</option>
                <option value="Europe">Europe</option>
                <option value="Oceania">Oceania</option>
              </select>
            </div>

            <button className="submit" type="submit">
              Search
            </button>
          </form>
        )}

        {isLoading && <p>Loading countries…</p>}

        {fetchError && <p role="alert">{fetchError}</p>}

        {submittedSearch && !isLoading && !fetchError && !searchError && (
          <>
            {filteredCountries.length > 0 ? (
              <p role="status">
                Found {filteredCountries.length} matching{' '}
                {filteredCountries.length === 1 ? 'country' : 'countries'}.
              </p>
            ) : (
              <p role="status">
                No countries matched “{submittedSearch}”. Try a different name.
              </p>
            )}
          </>
        )}

        {submittedSearch && visibleCountries.length > 0 && (
          <ul className="country-grid">
            {visibleCountries.map((country) => {
              const isDetailsExpanded =
                expandedCountryCode === country.countryCode

              return (
                <li key={country.countryCode}>
                  <CountryCard
                    country={country}
                    isDetailsExpanded={isDetailsExpanded}
                    onDetailsToggle={handleDetailsToggle}
                  />
                </li>
              )
            })}
          </ul>
        )}

        {submittedSearch && hasMoreCountries && (
          <button className="load-more" type="button" onClick={handleLoadMore}>
            Load more countries
          </button>
        )}
      </section>
    </>
  )
}

export default CountryExplorer
