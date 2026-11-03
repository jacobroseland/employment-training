import type { RestCountry } from './CountryExplorer'
import CountryExplorer from './CountryExplorer'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { delay, http, HttpResponse } from 'msw'
import { userEvent, within } from 'storybook/test'

const countriesEndpoint = 'https://countries.dev/countries'

const countries: RestCountry[] = [
  {
    name: 'United States',
    alpha3Code: 'USA',
    flags: { png: 'https://flagcdn.com/w320/us.png' },
    capital: 'Washington, D.C.',
    region: 'Americas',
    population: 331002651,
    languages: [{ name: 'English' }],
    currencies: [{ name: 'United States dollar', symbol: '$' }],
    timezones: ['UTC−12:00', 'UTC−05:00'],
  },
  {
    name: 'United Kingdom',
    alpha3Code: 'GBR',
    flags: { png: 'https://flagcdn.com/w320/gb.png' },
    capital: 'London',
    region: 'Europe',
    population: 67215293,
    languages: [{ name: 'English' }],
    currencies: [{ name: 'British pound', symbol: '£' }],
    timezones: ['UTC±00:00'],
  },
]

const successHandler = http.get(countriesEndpoint, () => {
  return HttpResponse.json(countries)
})

const meta = {
  title: 'Exercises/Country Explorer/Full Exercise',
  component: CountryExplorer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CountryExplorer>

export default meta
type Story = StoryObj<typeof meta>

export const SearchResults: Story = {
  parameters: {
    msw: {
      handlers: [successHandler],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const searchInput = await canvas.findByLabelText('Search for a country')

    await userEvent.type(searchInput, 'united')
    await userEvent.click(canvas.getByRole('button', { name: 'Search' }))
  },
}

export const EmptyResults: Story = {
  parameters: {
    msw: {
      handlers: [successHandler],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const searchInput = await canvas.findByLabelText('Search for a country')

    await userEvent.type(searchInput, 'not-a-country')
    await userEvent.click(canvas.getByRole('button', { name: 'Search' }))
  },
}

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(countriesEndpoint, async () => {
          await delay('infinite')
          return HttpResponse.json(countries)
        }),
      ],
    },
  },
}

export const RequestError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(countriesEndpoint, () => {
          return new HttpResponse(null, { status: 500 })
        }),
      ],
    },
  },
}
