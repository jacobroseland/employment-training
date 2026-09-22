import './CountryCard.css'
import type { Country } from '../CountryExplorer.types'

type CountryCardProps = {
  country: Country
  isDetailsExpanded: boolean
  onDetailsToggle: (countryCode: string) => void
}

function CountryCard({
  country,
  isDetailsExpanded,
  onDetailsToggle,
}: CountryCardProps) {
  const detailsId = `country-details-${country.countryCode}`

  return (
    <article className="country-card">
      <div className="flag-frame">
        <img
          src={country.flagImage}
          alt={country.flagAltText}
          className="flag"
        />
      </div>

      <h3>{country.countryName}</h3>

      <p>Capital: {country.capital}</p>

      <p>Population: {new Intl.NumberFormat().format(country.population)}</p>

      <div id={detailsId} className="details" hidden={!isDetailsExpanded}>
        <dl>
          <dt>Languages</dt>
          <dd>
            {country.languages.length > 0
              ? country.languages.join(', ')
              : 'No languages listed'}
          </dd>

          <dt>Currencies</dt>
          <dd>
            {country.currencies.length > 0
              ? country.currencies.join(', ')
              : 'No currencies listed'}
          </dd>

          <dt>Time zones</dt>
          <dd>
            {country.timeZones.length > 0
              ? country.timeZones.join(', ')
              : 'No time zones listed'}
          </dd>
        </dl>
      </div>
      <button
        type="button"
        className="details-toggle"
        aria-expanded={isDetailsExpanded}
        aria-controls={detailsId}
        onClick={() => onDetailsToggle(country.countryCode)}
      >
        {isDetailsExpanded ? 'Hide details' : 'Show details'}
      </button>
    </article>
  )
}

export default CountryCard
