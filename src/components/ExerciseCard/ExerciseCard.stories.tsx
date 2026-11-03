import ExerciseCard from './ExerciseCard'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

const meta = {
  title: 'Shared/ExerciseCard',
  component: ExerciseCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onOpen: fn(),
  },
} satisfies Meta<typeof ExerciseCard>

export default meta
type Story = StoryObj<typeof meta>

export const Available: Story = {
  args: {
    exercise: {
      id: 'country-explorer',
      title: 'Country Explorer',
      description:
        'Search for countries, filter returned results by region, and expand a country for its details.',
      status: 'available',
      Component: () => null,
    },
  },
}

export const ComingSoon: Story = {
  args: {
    exercise: {
      id: 'personal-greeting',
      title: 'Personal Greeting',
      description: 'Use a typed prop to display a personalized message.',
      status: 'coming-soon',
    },
  },
}
