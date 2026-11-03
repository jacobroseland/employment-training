import type { Country } from '../CountryExplorer.types'
import CountryCard from './CountryCard'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

const country: Country = {
  countryName: 'United States',
  countryCode: 'USA',
  flagImage: 'https://flagcdn.com/w320/us.png',
  flagAltText: 'Flag of the United States',
  capital: 'Washington, D.C.',
  region: 'Americas',
  population: 331002651,
  languages: ['English'],
  currencies: ['United States dollar ($)'],
  timeZones: ['UTC−12:00', 'UTC−05:00', 'UTC−10:00'],
}

const meta = {
  title: 'Exercises/Country Explorer/Components/CountryCard',
  component: CountryCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    country,
    isDetailsExpanded: false,
    onDetailsToggle: fn(),
  },
} satisfies Meta<typeof CountryCard>

export default meta
type Story = StoryObj<typeof meta>

export const Collapsed: Story = {}

export const Expanded: Story = {
  args: {
    isDetailsExpanded: true,
  },
}

export const MissingOptionalDetails: Story = {
  args: {
    country: {
      ...country,
      countryName: 'Example Island',
      countryCode: 'EXI',
      flagAltText: 'Flag of Example Island',
      capital: 'No capital listed',
      languages: [],
      currencies: [],
      timeZones: [],
    },
    isDetailsExpanded: true,
  },
}
