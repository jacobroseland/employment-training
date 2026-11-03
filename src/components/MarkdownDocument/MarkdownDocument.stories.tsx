import MarkdownDocument from './MarkdownDocument'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Shared/MarkdownDocument',
  component: MarkdownDocument,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MarkdownDocument>

export default meta
type Story = StoryObj<typeof meta>

export const LearningNote: Story = {
  args: {
    content: `# State updates

Use a **state updater function** when the next value relies on the current value.

\`\`\`tsx
setCount((currentCount) => currentCount + 1)
\`\`\`

- It avoids stale values.
- It keeps the update easy to read.
`,
  },
}
