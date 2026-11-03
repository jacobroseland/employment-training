import HelloWorld from './HelloWorld'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Exercises/Hello World/Full Exercise',
  component: HelloWorld,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HelloWorld>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
