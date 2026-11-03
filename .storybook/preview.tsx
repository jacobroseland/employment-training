import '../src/index.css'
import type { Preview } from '@storybook/react-vite'
import { mswLoader } from 'msw-storybook-addon/csf3'

const preview: Preview = {
  decorators: [(Story, context) => <Story key={context.id} />],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  loaders: [mswLoader()],
}

export default preview
