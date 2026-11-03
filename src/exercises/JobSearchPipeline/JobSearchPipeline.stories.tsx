import JobSearchPipeline from './JobSearchPipeline'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Exercises/Job Search Pipeline/Full Exercise',
  component: JobSearchPipeline,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  beforeEach: () => {
    localStorage.clear()
  },
} satisfies Meta<typeof JobSearchPipeline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
