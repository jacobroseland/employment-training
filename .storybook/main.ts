import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    'msw-storybook-addon',
  ],
  features: {
    menuOnboardingChecklist: false,
    sidebarOnboardingChecklist: false,
  },
  framework: '@storybook/react-vite',
  staticDirs: ['../public'],
}
export default config
